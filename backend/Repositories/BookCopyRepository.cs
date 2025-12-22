using backend.Data;
using backend.Models;
using backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class BookCopyRepository : IBookCopyRepository
    {
        private readonly LibraryDbContext _context;

        public BookCopyRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<BookCopy>> GetAllAsync()
        {
            return await _context.BookCopies
                .Include(bc => bc.Book)
                .ToListAsync();
        }

        public async Task<BookCopy?> GetByIdAsync(int id)
        {
            return await _context.BookCopies
                .Include(bc => bc.Book)
                .FirstOrDefaultAsync(bc => bc.CopyId == id);
        }

        public async Task<BookCopy> AddAsync(BookCopy bookCopy)
        {
            _context.BookCopies.Add(bookCopy);
            await _context.SaveChangesAsync();
            return bookCopy;
        }

        public async Task<BookCopy> UpdateAsync(BookCopy bookCopy)
        {
            _context.Entry(bookCopy).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return bookCopy;
        }

        public async Task DeleteAsync(int id)
        {
            var bookCopy = await _context.BookCopies.FindAsync(id);
            if (bookCopy != null)
            {
                _context.BookCopies.Remove(bookCopy);
                await _context.SaveChangesAsync();
            }
        }
    }
}