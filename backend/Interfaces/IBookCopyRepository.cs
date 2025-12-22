using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Interfaces
{
    public interface IBookCopyRepository
    {
        Task<List<BookCopy>> GetAllAsync();
        Task<BookCopy?> GetByIdAsync(int id);
        Task<BookCopy> AddAsync(BookCopy bookCopy);
        Task<BookCopy> UpdateAsync(BookCopy bookCopy);
        Task DeleteAsync(int id);
    }
}