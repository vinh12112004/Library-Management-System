using AutoMapper;
using backend.DTOs.Loan;
using backend.DTOs.Shared;
using backend.Interfaces;

namespace backend.Services.Loan
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IMapper _mapper;

        public LoanService(ILoanRepository loanRepository, IMapper mapper)
        {
            _loanRepository = loanRepository;
            _mapper = mapper;
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

        public async Task<LoanDto> CreateLoanAsync(CreateLoanDto createLoanDto)
        {
            var loanModel = _mapper.Map<Models.Loan>(createLoanDto);
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

            _mapper.Map(updateLoanDto, loan);
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