using System.Security.Claims;
using backend.DTOs.Loan;
using backend.Services.Loan;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        // GET: api/Loan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetLoans([FromQuery] LoanQuery query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber và PageSize phải > 0");

            query.PageSize = Math.Min(query.PageSize, 50);

            var result = await _loanService.GetAllLoansAsync(query);
            return Ok(result);
        }

        // GET: api/Loan/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoanDto>> GetLoan(int id)
        {
            var loanDto = await _loanService.GetLoanByIdAsync(id);

            if (loanDto == null)
            {
                return NotFound();
            }

            return Ok(loanDto);
        }

        // POST: api/Loan
        [HttpPost]
        public async Task<ActionResult<LoanDto>> PostLoan(CreateLoanDto createLoanDto)
        {
            var accountId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var newLoanDto = await _loanService.CreateLoanAsync(accountId,createLoanDto);
            return CreatedAtAction(nameof(GetLoan), new { id = newLoanDto.LoanId }, newLoanDto);
        }

        // PUT: api/Loan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoan(int id, UpdateLoanDto updateLoanDto)
        {
            var wasUpdated = await _loanService.UpdateLoanAsync(id, updateLoanDto);
            if (!wasUpdated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Loan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoan(int id)
        {
            var wasDeleted = await _loanService.DeleteLoanAsync(id);
            if (!wasDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        // GET: api/Loan/member/5
        [HttpGet("member/{memberId}")]
        public async Task<IActionResult> GetLoansByMember(int memberId)
        {
            var loans = await _loanService.GetLoansByMemberIdAsync(memberId);
            return Ok(loans);
        }
    }
}