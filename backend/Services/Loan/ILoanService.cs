using backend.DTOs.Loan;
using backend.DTOs.Shared;

namespace backend.Services.Loan;

public interface ILoanService
{
    Task<PagedResult<LoanDto>> GetAllLoansAsync(LoanQuery query);
    Task<LoanDto?> GetLoanByIdAsync(int id);
    Task<LoanDto> CreateLoanAsync(int accId,CreateLoanDto createLoanDto);
    Task<bool> UpdateLoanAsync(int id, UpdateLoanDto updateLoanDto);
    Task<bool> DeleteLoanAsync(int id);
    Task<IEnumerable<LoanDto>> GetLoansByMemberIdAsync(int memberId);
}