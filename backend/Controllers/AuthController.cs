using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using backend.Services;
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

        private static string GenerateMemberCode()
        {
            var rnd = Random.Shared.Next(1000, 9999);
            return $"MB{DateTime.UtcNow:yyyyMMddHHmmss}{rnd}";
        }
    }
}
