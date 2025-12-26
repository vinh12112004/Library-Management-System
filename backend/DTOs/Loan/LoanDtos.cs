using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Loan;

public class LoanDto
{
    public int LoanId { get; set; }
    public int MemberId { get; set; }
    public string MemberName { get; set; }
    public int CopyId { get; set; }
    public string BookTitle { get; set; }
    public int? StaffId { get; set; }
    public string StaffName { get; set; }
    public string LoanDate { get; set; }
    public string DueDate { get; set; }
    public string ReturnDate { get; set; }
    public string Status { get; set; }
    public int RenewalCount { get; set; }
    public string Notes { get; set; }
}

public class CreateLoanDto
{
    [Required]
    public int MemberId { get; set; }

    [Required]
    public int CopyId { get; set; }

    public int? StaffId { get; set; }

    [Required]
    public DateTime LoanDate { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    public string Notes { get; set; }
}

public class UpdateLoanDto
{
    public DateTime? ReturnDate { get; set; }
    public LoanStatus? Status { get; set; }
    public string? Notes { get; set; }
}