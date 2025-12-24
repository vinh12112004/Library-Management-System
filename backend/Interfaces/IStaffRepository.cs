using backend.Models;

namespace backend.Interfaces;

public interface IStaffRepository
{
    Task<IEnumerable<Staff>> GetAllAsync();
    Task<Staff?> GetByIdAsync(int id);
    Task<Staff> UpdateAsync(Staff staff);
    Task<bool> DeleteAsync(int id);
}