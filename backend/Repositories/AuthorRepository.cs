using backend.Data;
using backend.DTOs.Author;
using backend.DTOs.Shared;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly LibraryDbContext _context;

        public AuthorRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Author>> GetAllAsync(AuthorQuery query)
        {
            var authors = _context.Authors.AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(query.Name))
            {
                var keyword = query.Name.Trim();

                authors = authors.Where(a =>
                    EF.Functions.Like(a.FullName, $"%{keyword}%")
                );
            }

            var totalCount = await authors.CountAsync();

            var items = await authors
                .OrderBy(a => a.AuthorId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<Author>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        public async Task<Author?> GetByIdAsync(int id)
        {
            return await _context.Authors.FindAsync(id);
        }

        public async Task<Author> AddAsync(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();
            return author;
        }

        public async Task<Author> UpdateAsync(Author author)
        {
            _context.Entry(author).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return author;
        }

        public async Task DeleteAsync(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author != null)
            {
                _context.Authors.Remove(author);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Book>> GetBooksByAuthorIdAsync(int authorId)
        {
            return await _context.BookAuthors
                .Where(ba => ba.AuthorId == authorId)
                .Include(ba => ba.Book)
                .Select(ba => ba.Book)
                .Distinct()
                .ToListAsync();
        }

    }
}