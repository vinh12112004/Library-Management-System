namespace backend.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalBooks { get; set; }
    public int TotalMembers { get; set; }
    public int TotalLoans { get; set; }
    public int ActiveLoans { get; set; }
    public int OverdueLoans { get; set; }
    public int AvailableCopies { get; set; }
    public int BorrowedCopies { get; set; }
    public List<CategoryStatDto> CategoryStats { get; set; } = new();
    public List<RecentLoanDto> RecentLoans { get; set; } = new();
    public List<PopularBookDto> PopularBooks { get; set; } = new();
}

public class CategoryStatDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int BookCount { get; set; }
}

public class RecentLoanDto
{
    public int LoanId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public string BookTitle { get; set; } = string.Empty;
    public DateTime LoanDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class PopularBookDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public int LoanCount { get; set; }
}