using backend.DTOs.Staff;

namespace backend.Services.Staff;

public interface IStaffService
{
    Task<IEnumerable<StaffDto>> GetAllStaffsAsync();
    Task<StaffDto?> GetStaffByIdAsync(int id);
    Task<bool> UpdateStaffAsync(int id, UpdateStaffDto updateStaffDto);
    Task<bool> DeleteStaffAsync(int id);
}