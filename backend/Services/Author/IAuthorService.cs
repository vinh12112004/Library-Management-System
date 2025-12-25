using backend.DTOs.Author;
using backend.DTOs.Book;
using backend.DTOs.Shared;

namespace backend.Services.Author
{
    public interface IAuthorService
    {
        Task<PagedResult<AuthorDto>> GetAllAuthorsAsync(AuthorQuery query);
        Task<AuthorDto?> GetAuthorByIdAsync(int id);
        Task<AuthorDto> CreateAuthorAsync(CreateAuthorDto createAuthorDto);
        Task<bool> UpdateAuthorAsync(int id, UpdateAuthorDto updateAuthorDto);
        Task<bool> DeleteAuthorAsync(int id);
        Task<IEnumerable<BookDto>> GetBooksByAuthorIdAsync(int authorId);

    }
}