using AutoMapper;
using backend.DTOs.Author;
using backend.DTOs.Book;
using backend.DTOs.Shared;
using backend.Interfaces;
using backend.Models;

namespace backend.Services.Author
{
    public class AuthorService : IAuthorService
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IMapper _mapper;

        public AuthorService(IAuthorRepository authorRepository, IMapper mapper)
        {
            _authorRepository = authorRepository;
            _mapper = mapper;
        }

        public async Task<PagedResult<AuthorDto>> GetAllAuthorsAsync(AuthorQuery query)
        {
            var pagedAuthors = await _authorRepository.GetAllAsync(query);

            var dtoItems = pagedAuthors.Items.Select(a => new AuthorDto
            {
                AuthorId = a.AuthorId,
                FullName = a.FullName,
                Biography = a.Biography
            }).ToList();

            return new PagedResult<AuthorDto>(
                dtoItems,
                pagedAuthors.TotalCount,
                pagedAuthors.PageNumber,
                pagedAuthors.PageSize
            );
        }

        public async Task<AuthorDto?> GetAuthorByIdAsync(int id)
        {
            var author = await _authorRepository.GetByIdAsync(id);
            return author == null ? null : _mapper.Map<AuthorDto>(author);
        }

        public async Task<AuthorDto> CreateAuthorAsync(CreateAuthorDto createAuthorDto)
        {
            var authorModel = _mapper.Map<Models.Author>(createAuthorDto);
            var newAuthor = await _authorRepository.AddAsync(authorModel);
            return _mapper.Map<AuthorDto>(newAuthor);
        }

        public async Task<bool> UpdateAuthorAsync(int id, UpdateAuthorDto updateAuthorDto)
        {
            var author = await _authorRepository.GetByIdAsync(id);
            if (author == null)
            {
                return false;
            }

            _mapper.Map(updateAuthorDto, author);
            await _authorRepository.UpdateAsync(author);

            return true;
        }

        public async Task<bool> DeleteAuthorAsync(int id)
        {
            var author = await _authorRepository.GetByIdAsync(id);
            if (author == null)
            {
                return false;
            }

            await _authorRepository.DeleteAsync(id);
            return true;
        }
        
        public async Task<IEnumerable<BookDto>> GetBooksByAuthorIdAsync(int authorId)
        {
            var books = await _authorRepository.GetBooksByAuthorIdAsync(authorId);
            return _mapper.Map<IEnumerable<BookDto>>(books);
        }
    }
}