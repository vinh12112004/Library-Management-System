using AutoMapper;
using backend.DTOs.Author;
using backend.DTOs.Book;
using backend.DTOs.Category;
using backend.DTOs.Publisher;
using backend.Models;

namespace backend.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Author
            CreateMap<Author, AuthorDto>()
                .ForMember(dest => dest.DateOfBirth,
                    opt => opt.MapFrom(src => src.DateOfBirth.HasValue
                        ? src.DateOfBirth.Value.ToString("dd-MM-yyyy")
                        : null));
            CreateMap<CreateAuthorDto, Author>();
            CreateMap<UpdateAuthorDto, Author>();

            // Category
            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Book
            CreateMap<Book, BookDto>()
                .ForMember(dest => dest.Authors,
                    opt => opt.MapFrom(src =>
                        src.BookAuthors != null
                            ? src.BookAuthors
                                .Where(ba => ba.Author != null)
                                .Select(ba => ba.Author.FullName)
                                .ToList()
                            : new List<string>()))
                .ForMember(dest => dest.Categories,
                    opt => opt.MapFrom(src =>
                        src.BookCategories != null
                            ? src.BookCategories
                                .Where(bc => bc.Category != null)
                                .Select(bc => bc.Category.Name)
                                .ToList()
                            : new List<string>()));

            CreateMap<CreateBookDto, Book>();
            CreateMap<UpdateBookDto, Book>();
        }
    }
}
