using backend.DTOs.Loan;
using backend.DTOs.Shared;
using backend.Models;

namespace backend.Interfaces;

public interface ILoanRepository
{
    Task<PagedResult<Loan>> GetAllAsync(LoanQuery query);
    Task<Loan?> GetByIdAsync(int id);
    Task<Loan> AddAsync(Loan loan);
    Task<Loan> UpdateAsync(Loan loan);
    Task DeleteAsync(int id);
    Task<IEnumerable<Loan>> GetLoansByMemberIdAsync(int memberId);
}