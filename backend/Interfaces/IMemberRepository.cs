using backend.Models;

namespace backend.Interfaces;

public interface IMemberRepository
{
    Task<IEnumerable<Member>> GetAllAsync();
    Task<Member?> GetByIdAsync(int id);
    Task<Member> UpdateAsync(Member member);
    Task<bool> DeleteAsync(int id);
    Task<int> GetMemberIdByAccountIdAsync(int accountId);
}
