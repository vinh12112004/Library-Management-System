using AutoMapper;
using backend.DTOs.Loan;
using backend.DTOs.Shared;
using backend.Interfaces;
using backend.Models;
using backend.Services.Staff;

namespace backend.Services.Loan
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IBookCopyRepository _bookCopyRepository;
        private readonly IMapper _mapper;

        public LoanService(ILoanRepository loanRepository, IMapper mapper, IStaffRepository staffRepository, IBookCopyRepository bookCopyRepository)
        {
            _loanRepository = loanRepository;
            _mapper = mapper;
            _staffRepository = staffRepository;
            _bookCopyRepository = bookCopyRepository;
        }

        public async Task<PagedResult<LoanDto>> GetAllLoansAsync(LoanQuery query)
        {
            var pagedLoans = await _loanRepository.GetAllAsync(query);

            var dtoItems = _mapper.Map<List<LoanDto>>(pagedLoans.Items);

            return new PagedResult<LoanDto>(
                dtoItems,
                pagedLoans.TotalCount,
                pagedLoans.PageNumber,
                pagedLoans.PageSize
            );
        }

        public async Task<LoanDto?> GetLoanByIdAsync(int id)
        {
            var loan = await _loanRepository.GetByIdAsync(id);
            return loan == null ? null : _mapper.Map<LoanDto>(loan);
        }

        public async Task<LoanDto> CreateLoanAsync(int accid,CreateLoanDto createLoanDto)
        {
            var staffId = await _staffRepository.GetStaffIdByAccountIdAsync(accid);

            if (staffId == null)
                throw new Exception($"No staff linked with accountId = {accid}");

            createLoanDto.StaffId = staffId;
            var loanModel = _mapper.Map<Models.Loan>(createLoanDto);
            
            // Update BookCopy status to Borrowed
            var bookCopy = await _bookCopyRepository.GetByIdAsync(loanModel.CopyId);
            if (bookCopy != null)
            {
                bookCopy.Status = CopyStatus.Borrowed;
                await _bookCopyRepository.UpdateAsync(bookCopy);
            }
            
            var newLoan = await _loanRepository.AddAsync(loanModel);
            return _mapper.Map<LoanDto>(newLoan);
        }

        public async Task<bool> UpdateLoanAsync(int id, UpdateLoanDto updateLoanDto)
        {
            var loan = await _loanRepository.GetByIdAsync(id);
            if (loan == null)
            {
                return false;
            }

            var oldStatus = loan.Status;
            _mapper.Map(updateLoanDto, loan);
            
            // Update BookCopy status based on loan status
            if (oldStatus != loan.Status)
            {
                var bookCopy = await _bookCopyRepository.GetByIdAsync(loan.CopyId);
                if (bookCopy != null)
                {
                    bookCopy.Status = loan.Status switch
                    {
                        LoanStatus.Borrowing => CopyStatus.Borrowed,
                        LoanStatus.Returned => CopyStatus.Available,
                        LoanStatus.Lost => CopyStatus.Lost,
                        LoanStatus.Overdue => CopyStatus.Borrowed,
                        _ => bookCopy.Status
                    };
                    await _bookCopyRepository.UpdateAsync(bookCopy);
                }
            }

            await _loanRepository.UpdateAsync(loan);

            return true;
        }

        public async Task<bool> DeleteLoanAsync(int id)
        {
            var loan = await _loanRepository.GetByIdAsync(id);
            if (loan == null)
            {
                return false;
            }

            await _loanRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<LoanDto>> GetLoansByMemberIdAsync(int memberId)
        {
            var loans = await _loanRepository.GetLoansByMemberIdAsync(memberId);
            return _mapper.Map<IEnumerable<LoanDto>>(loans);
        }
    }
}