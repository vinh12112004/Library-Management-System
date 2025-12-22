using AutoMapper;
using backend.DTOs.BookCopy;
using backend.Interfaces;

namespace backend.Services.BookCopy
{
    public class BookCopyService : IBookCopyService
    {
        private readonly IBookCopyRepository _bookCopyRepository;
        private readonly IMapper _mapper;

        public BookCopyService(IBookCopyRepository bookCopyRepository, IMapper mapper)
        {
            _bookCopyRepository = bookCopyRepository;
            _mapper = mapper;
        }

        public async Task<List<BookCopyDto>> GetAllBookCopiesAsync()
        {
            var bookCopies = await _bookCopyRepository.GetAllAsync();
            return _mapper.Map<List<BookCopyDto>>(bookCopies);
        }

        public async Task<BookCopyDto?> GetBookCopyByIdAsync(int id)
        {
            var bookCopy = await _bookCopyRepository.GetByIdAsync(id);
            return bookCopy == null ? null : _mapper.Map<BookCopyDto>(bookCopy);
        }

        public async Task<BookCopyDto> CreateBookCopyAsync(CreateBookCopyDto createBookCopyDto)
        {
            var bookCopyModel = _mapper.Map<backend.Models.BookCopy>(createBookCopyDto);
            var newBookCopy = await _bookCopyRepository.AddAsync(bookCopyModel);
            return _mapper.Map<BookCopyDto>(newBookCopy);
        }

        public async Task<bool> UpdateBookCopyAsync(int id, UpdateBookCopyDto updateBookCopyDto)
        {
            var bookCopy = await _bookCopyRepository.GetByIdAsync(id);
            if (bookCopy == null)
            {
                return false;
            }

            _mapper.Map(updateBookCopyDto, bookCopy);
            await _bookCopyRepository.UpdateAsync(bookCopy);
            return true;
        }

        public async Task<bool> DeleteBookCopyAsync(int id)
        {
            var bookCopy = await _bookCopyRepository.GetByIdAsync(id);
            if (bookCopy == null)
            {
                return false;
            }

            await _bookCopyRepository.DeleteAsync(id);
            return true;
        }
    }
}