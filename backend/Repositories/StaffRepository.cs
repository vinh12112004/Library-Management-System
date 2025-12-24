using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class StaffRepository : IStaffRepository
{
    private readonly LibraryDbContext _context;

    public StaffRepository(LibraryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Staff>> GetAllAsync()
    {
        return await _context.Staffs
            .Include(s => s.Account)
            .ThenInclude(a => a.AccountRoles)
            .ToListAsync();
    }

    public async Task<Staff?> GetByIdAsync(int id)
    {
        return await _context.Staffs
            .Include(s => s.Account)
            .ThenInclude(a => a.AccountRoles)
            .FirstOrDefaultAsync(s => s.StaffId == id);
    }

    public async Task<Staff> UpdateAsync(Staff staff)
    {
        _context.Entry(staff).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return staff;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var staff = await _context.Staffs
            .Include(s => s.Account)
            .FirstOrDefaultAsync(s => s.StaffId == id);

        if (staff == null)
            return false;

        _context.Accounts.Remove(staff.Account);
        _context.Staffs.Remove(staff);

        await _context.SaveChangesAsync();
        return true;
    }
}