namespace backend.Services.BookCopy;

using backend.DTOs.Book;
using backend.DTOs.BookCopy;
using backend.DTOs.Shared;

public interface IBookCopyService
{
    Task<List<BookCopyDto>> GetAllBookCopiesAsync();
    Task<BookCopyDto?> GetBookCopyByIdAsync(int id);
    Task<BookCopyDto> CreateBookCopyAsync(CreateBookCopyDto createBookCopyDto);
    Task<bool> UpdateBookCopyAsync(int id, UpdateBookCopyDto updateBookCopyDto);
    Task<bool> DeleteBookCopyAsync(int id);
}