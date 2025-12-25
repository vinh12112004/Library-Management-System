using backend.Data;
using backend.DTOs.Loan;
using backend.DTOs.Shared;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class LoanRepository : ILoanRepository
    {
        private readonly LibraryDbContext _context;

        public LoanRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Loan>> GetAllAsync(LoanQuery query)
        {
            var loans = _context.Loans
                .Include(l => l.Member)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .Include(l => l.Staff)
                .AsQueryable();

            if (query.MemberId.HasValue)
            {
                loans = loans.Where(l => l.MemberId == query.MemberId.Value);
            }

            if (query.Status.HasValue)
            {
                loans = loans.Where(l => l.Status == query.Status.Value);
            }

            if (query.FromDate.HasValue)
            {
                loans = loans.Where(l => l.LoanDate >= query.FromDate.Value);
            }

            if (query.ToDate.HasValue)
            {
                loans = loans.Where(l => l.LoanDate <= query.ToDate.Value);
            }

            var totalCount = await loans.CountAsync();

            var items = await loans
                .OrderByDescending(l => l.LoanDate)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<Loan>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        public async Task<Loan?> GetByIdAsync(int id)
        {
            return await _context.Loans
                .Include(l => l.Member)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .Include(l => l.Staff)
                .FirstOrDefaultAsync(l => l.LoanId == id);
        }

        public async Task<Loan> AddAsync(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan> UpdateAsync(Loan loan)
        {
            _context.Entry(loan).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task DeleteAsync(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                _context.Loans.Remove(loan);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Loan>> GetLoansByMemberIdAsync(int memberId)
        {
            return await _context.Loans
                .Where(l => l.MemberId == memberId)
                .Include(l => l.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .ToListAsync();
        }
    }