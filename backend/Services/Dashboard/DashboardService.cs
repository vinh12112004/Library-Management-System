using backend.Data;
using backend.DTOs.Dashboard;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Dashboard;

public class DashboardService : IDashboardService
{
    private readonly LibraryDbContext _context;

    public DashboardService(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardStatsAsync()
    {
        var dashboard = new DashboardDto();

        // Total counts
        dashboard.TotalBooks = await _context.Books.CountAsync();
        dashboard.TotalMembers = await _context.Members.CountAsync();
        dashboard.TotalLoans = await _context.Loans.CountAsync();

        // Active loans (not returned)
        dashboard.ActiveLoans = await _context.Loans
            .CountAsync(l => l.ReturnDate == null);

        // Overdue loans
        dashboard.OverdueLoans = await _context.Loans
            .CountAsync(l => l.Status == LoanStatus.Overdue);

        // Available copies
        dashboard.AvailableCopies = await _context.BookCopies
            .CountAsync(bc => bc.Status == CopyStatus.Available);

        // Borrowed copies
        dashboard.BorrowedCopies = await _context.BookCopies
            .CountAsync(bc => bc.Status == CopyStatus.Borrowed);

        // Category statistics
        var categoryStats = await _context.BookCategories
            .Include(bc => bc.Category)
            .GroupBy(bc => new { bc.Category.CategoryId, bc.Category.Name })
            .Select(g => new CategoryStatDto
            {
                CategoryName = g.Key.Name,
                BookCount = g.Count()
            })
            .OrderByDescending(cs => cs.BookCount)
            .Take(5)
            .ToListAsync();
        dashboard.CategoryStats = categoryStats;

        // Recent loans (last 10)
        var recentLoans = await _context.Loans
            .Include(l => l.Member)
            .Include(l => l.BookCopy)
                .ThenInclude(bc => bc.Book)
            .OrderByDescending(l => l.LoanDate)
            .Take(10)
            .Select(l => new RecentLoanDto
            {
                LoanId = l.LoanId,
                MemberName = l.Member.FullName,
                BookTitle = l.BookCopy.Book.Title,
                LoanDate = l.LoanDate,
                DueDate = l.DueDate,
                Status = l.ReturnDate == null 
                    ? (l.DueDate < DateTime.Now ? "Overdue" : "Borrowing")
                    : "Returned"
            })
            .ToListAsync();
        dashboard.RecentLoans = recentLoans;

        // Popular books (most borrowed)
        var popularBooks = await _context.Loans
            .Include(l => l.BookCopy)
                .ThenInclude(bc => bc.Book)
                    .ThenInclude(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
            .GroupBy(l => new 
            { 
                l.BookCopy.Book.BookId, 
                l.BookCopy.Book.Title
            })
            .Select(g => new 
            {
                g.Key.BookId,
                g.Key.Title,
                LoanCount = g.Count()
            })
            .OrderByDescending(x => x.LoanCount)
            .Take(10)
            .ToListAsync();

        // Get author names for popular books
        var bookIds = popularBooks.Select(pb => pb.BookId).ToList();
        var booksWithAuthors = await _context.Books
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .Where(b => bookIds.Contains(b.BookId))
            .Select(b => new 
            { 
                b.BookId, 
                AuthorName = b.BookAuthors
                    .Where(ba => ba.Author != null)
                    .Select(ba => ba.Author.FullName)
                    .FirstOrDefault() ?? "Unknown"
            })
            .ToListAsync();

        dashboard.PopularBooks = popularBooks
            .Select(pb => new PopularBookDto
            {
                BookId = pb.BookId,
                Title = pb.Title,
                AuthorName = booksWithAuthors.FirstOrDefault(b => b.BookId == pb.BookId)?.AuthorName ?? "Unknown",
                LoanCount = pb.LoanCount
            })
            .ToList();

        return dashboard;
    }
}