using backend.DTOs.Member;

namespace backend.Services.Member;

public interface IMemberService
{
    Task<IEnumerable<MemberDto>> GetAllMembersAsync();
    Task<MemberDto?> GetMemberByIdAsync(int id);
    Task<bool> UpdateMemberAsync(int id, UpdateMemberDto updateMemberDto);
    Task<bool> DeleteMemberAsync(int id);
}