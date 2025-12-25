using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class MemberRepository : IMemberRepository
{
    private readonly LibraryDbContext _context;

    public MemberRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Member>> GetAllAsync()
    {
        return await _context.Members.ToListAsync();
    }

    public async Task<Member?> GetByIdAsync(int id)
    {
        return await _context.Members.FindAsync(id);
    }

    public async Task<Member> UpdateAsync(Member member)
    {
        _context.Entry(member).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return member;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var member = await _context.Members
            .Include(s => s.Account)
            .FirstOrDefaultAsync(s => s.MemberId == id);
        if (member == null)
            return false;
        _context.Accounts.Remove(member.Account);
        _context.Members.Remove(member);

        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<int> GetMemberIdByAccountIdAsync(int accountId)
    {
        var member = await _context.Members
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.AccountId == accountId);
        if (member == null)
            return 0;
        return member.MemberId;
    }


}