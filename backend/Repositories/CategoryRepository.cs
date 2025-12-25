using backend.Data;
using backend.DTOs.Category;
using backend.DTOs.Shared;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly LibraryDbContext _context;

        public CategoryRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Category>> GetAllAsync(CategoryQuery query)
        {
            var categories = _context.Categories.AsQueryable();

            // 🔍 SEARCH theo Name
            if (!string.IsNullOrWhiteSpace(query.Name))
            {
                var keyword = query.Name.Trim();

                categories = categories.Where(c =>
                    EF.Functions.Like(c.Name, $"%{keyword}%")
                );
            }

            var totalCount = await categories.CountAsync();

            var items = await categories
                .OrderBy(c => c.CategoryId)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<Category>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryId == id);
        }

        public async Task<Category> AddAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateAsync(Category category)
        {
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }
}