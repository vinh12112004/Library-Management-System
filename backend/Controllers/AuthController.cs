using System.Security.Claims;
using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly LibraryDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(LibraryDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }
        
        [HttpPost("register-staff")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RegisterStaff([FromBody] StaffRegisterDto dto, CancellationToken ct)
        {
            if (await _db.Accounts.AnyAsync(a => a.Username == dto.Email, ct))
                return Conflict("Email đã tồn tại");

            if (await _db.Staffs.AnyAsync(s => s.StaffCode == dto.StaffCode, ct))
                return Conflict("Mã nhân viên đã tồn tại");

            using var tx = await _db.Database.BeginTransactionAsync(ct);

            var account = new Account
            {
                Username = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true
            };

            _db.Accounts.Add(account);
            await _db.SaveChangesAsync(ct);

            var staff = new Staff
            {
                AccountId = account.AccountId,
                StaffCode = dto.StaffCode,
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                IsActive = true
            };

            _db.Staffs.Add(staff);
            _db.AccountRoles.Add(new AccountRole
            {
                AccountId = account.AccountId,
                Role = dto.Role
            });

            await _db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            return Ok(new { staff.StaffId, staff.StaffCode });
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login(
            [FromBody] LoginDto dto,
            CancellationToken ct)
        {
            var account = await _db.Accounts
                .FirstOrDefaultAsync(a => a.Username == dto.Email, ct);

            if (account == null || !account.IsActive)
                return Unauthorized("Thông tin đăng nhập không hợp lệ");

            var ok = BCrypt.Net.BCrypt.Verify(dto.Password, account.PasswordHash);
            if (!ok)
                return Unauthorized("Thông tin đăng nhập không hợp lệ");

            var roles = await _db.AccountRoles
                .Where(r => r.AccountId == account.AccountId)
                .Select(r => r.Role.ToString())
                .ToListAsync(ct);

            var (token, expiresAt) = _tokenService.CreateToken(account, roles);

            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt
            };
        }

        [HttpPost("register-member")]
        [Authorize(Roles =  "Admin")]
        public async Task<ActionResult> RegisterMember([FromBody] MemberRegisterDto dto, CancellationToken ct)
        {
            var username = !string.IsNullOrWhiteSpace(dto.Email)
                ? dto.Email
                : GenerateMemberCode();

            if (await _db.Accounts.AnyAsync(a => a.Username == username, ct))
                return Conflict("Tài khoản đã tồn tại");

            var account = new Account
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                IsActive = true
            };

            _db.Accounts.Add(account);
            await _db.SaveChangesAsync(ct);

            var member = new Member
            {
                AccountId = account.AccountId,
                MemberCode = dto.MemberCode ?? GenerateMemberCode(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                DateOfBirth = dto.DateOfBirth,
                IdCard = dto.IdCard,
                MembershipType = MembershipType.Community,
                RegistrationDate = DateTime.UtcNow,
                Status = MemberStatus.Active
            };

            _db.Members.Add(member);

            _db.AccountRoles.Add(new AccountRole
            {
                AccountId = account.AccountId,
                Role = RoleType.Reader
            });

            await _db.SaveChangesAsync(ct);

            return Ok(new { member.MemberId, member.MemberCode });
        }
        
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct)
        {
            int accountId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            if (accountId==null)
                return Unauthorized("Không xác thực được người dùng");

            if (string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("Mật khẩu hiện tại và mật khẩu mới không được để trống");
            
            var account = await _db.Accounts.FirstOrDefaultAsync(a => a.AccountId == accountId, ct);
            if (account == null || !account.IsActive)
                return Unauthorized("Tài khoản không tồn tại hoặc bị khóa");

            // Kiểm tra mật khẩu hiện tại
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, account.PasswordHash))
                return BadRequest("Mật khẩu hiện tại không đúng");

            // Hash mật khẩu mới và cập nhật
            account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync(ct);

            return Ok(new { message = "Đổi mật khẩu thành công" });
        }
    
        [HttpPost("reset-password-member/{memberId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPasswordMember(int memberId, CancellationToken ct)
        {
            var member = await _db.Members
                .Include(m => m.Account)
                .FirstOrDefaultAsync(m => m.MemberId == memberId, ct);

            if (member == null)
                return NotFound("Không tìm thấy thành viên");

            if (member.Account == null)
                return BadRequest("Thành viên không có tài khoản");

            member.Account.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123123");
            await _db.SaveChangesAsync(ct);

            return Ok(new { message = "Đặt lại mật khẩu thành công. Mật khẩu mới: 123123" });
        }

        [HttpPost("reset-password-staff/{staffId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPasswordStaff(int staffId, CancellationToken ct)
        {
            var staff = await _db.Staffs
                .Include(s => s.Account)
                .FirstOrDefaultAsync(s => s.StaffId == staffId, ct);

            if (staff == null)
                return NotFound("Không tìm thấy nhân viên");

            if (staff.Account == null)
                return BadRequest("Nhân viên không có tài khoản");

            staff.Account.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123123");
            await _db.SaveChangesAsync(ct);

            return Ok(new { message = "Đặt lại mật khẩu thành công. Mật khẩu mới: 123123" });
        }
        
        private static string GenerateMemberCode()
        {
            var rnd = Random.Shared.Next(1000, 9999);
            return $"MB{DateTime.UtcNow:yyyyMMddHHmmss}{rnd}";
        }
    }
}
