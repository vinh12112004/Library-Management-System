using AutoMapper;
using backend.DTOs;
using backend.DTOs.Author;
using backend.DTOs.BookCopy;
using backend.DTOs.Category;
using backend.DTOs.Loan;
using backend.DTOs.Member;
using backend.DTOs.Publisher;
using backend.DTOs.Staff;
using backend.Models;
using BookDto = backend.DTOs.Book.BookDto;
using CreateBookDto = backend.DTOs.Book.CreateBookDto;
using UpdateBookDto = backend.DTOs.Book.UpdateBookDto;

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

            CreateMap<CreateBookCopyDto, BookCopy>();
            CreateMap<UpdateBookCopyDto, BookCopy>();
            CreateMap<BookCopy, BookCopyDto>();
            // Member   
            CreateMap<Member, MemberDto>()
                .ForMember(dest => dest.DateOfBirth,
                    opt => opt.MapFrom(src => src.DateOfBirth.HasValue
                        ? src.DateOfBirth.Value.ToString("dd-MM-yyyy")
                        : null));
            CreateMap<UpdateMemberDto, Member>();
            
            // Staff
            CreateMap<Staff, StaffDto>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src =>
                        src.Account.AccountRoles
                            .Select(ar => ar.Role)
                            .FirstOrDefault()
                    ));

            CreateMap<UpdateStaffDto, Staff>();
            
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderType, opt => opt.MapFrom(src => src.SenderType.ToString()));
            
            CreateMap<Conversation, ConversationDto>()
                .ForMember(dest => dest.ReaderName, opt => opt.MapFrom(src => src.Reader.FullName))
                .ForMember(dest => dest.LastMessage, opt => opt.MapFrom(src => 
                    src.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault().Content ?? ""))
                .ForMember(dest => dest.LastMessageTime, opt => opt.MapFrom(src => 
                    src.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault().CreatedAt));
            
                // Loan
                CreateMap<Loan, LoanDto>()
                    .ForMember(dest => dest.MemberName,
                        opt => opt.MapFrom(src => src.Member.FullName))
                    .ForMember(dest => dest.BookTitle,
                        opt => opt.MapFrom(src => src.BookCopy.Book.Title))
                    .ForMember(dest => dest.StaffName,
                        opt => opt.MapFrom(src => src.Staff != null ? src.Staff.FullName : null))
                    .ForMember(dest => dest.LoanDate,
                        opt => opt.MapFrom(src => src.LoanDate.ToString("dd-MM-yyyy")))
                    .ForMember(dest => dest.DueDate,
                        opt => opt.MapFrom(src => src.DueDate.ToString("dd-MM-yyyy")))
                    .ForMember(dest => dest.ReturnDate,
                        opt => opt.MapFrom(src => src.ReturnDate.HasValue
                            ? src.ReturnDate.Value.ToString("dd-MM-yyyy")
                            : null))
                    .ForMember(dest => dest.Status,
                        opt => opt.MapFrom(src => src.Status.ToString()));

                CreateMap<CreateLoanDto, Loan>();
                CreateMap<UpdateLoanDto, Loan>();
                
                // bookcopy
                CreateMap<CreateBookCopyDto, BookCopy>();
                CreateMap<UpdateBookCopyDto, BookCopy>();
                CreateMap<BookCopy, BookCopyDto>()
                    .ForMember(dest => dest.BookTitle,
                        opt => opt.MapFrom(src => src.Book != null ? src.Book.Title : null));

        }
    }
}
