using backend.DTOs.Author;
using backend.DTOs.Shared;
using backend.Models;

namespace backend.Interfaces
{
    public interface IAuthorRepository
    {
        Task<PagedResult<Author>> GetAllAsync(AuthorQuery query);
        Task<Author?> GetByIdAsync(int id);
        Task<Author> AddAsync(Author author);
        Task<Author> UpdateAsync(Author author);
        Task DeleteAsync(int id);
        Task<IEnumerable<Book>> GetBooksByAuthorIdAsync(int authorId);
    }
}