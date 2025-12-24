using AutoMapper;
using backend.DTOs.Member;
using backend.Interfaces;

namespace backend.Services.Member;

public class MemberService : IMemberService
{
    private readonly IMemberRepository _memberRepository;
    private readonly IMapper _mapper;

    public MemberService(IMemberRepository memberRepository, IMapper mapper)
    {
        _memberRepository = memberRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<MemberDto>> GetAllMembersAsync()
    {
        var members = await _memberRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<MemberDto>>(members);
    }

    public async Task<MemberDto?> GetMemberByIdAsync(int id)
    {
        var member = await _memberRepository.GetByIdAsync(id);
        return member == null ? null : _mapper.Map<MemberDto>(member);
    }

    public async Task<bool> UpdateMemberAsync(int id, UpdateMemberDto updateMemberDto)
    {
        var member = await _memberRepository.GetByIdAsync(id);
        if (member == null)
        {
            return false;
        }

        _mapper.Map(updateMemberDto, member);
        await _memberRepository.UpdateAsync(member);

        return true;
    }

    public async Task<bool> DeleteMemberAsync(int id)
    {
        var member = await _memberRepository.GetByIdAsync(id);
        if (member == null)
        {
            return false;
        }

        await _memberRepository.DeleteAsync(id);
        return true;
    }
}