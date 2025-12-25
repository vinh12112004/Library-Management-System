using backend.Models;

namespace backend.DTOs.Loan;

public class LoanQuery
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? MemberId { get; set; }
    public LoanStatus? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}