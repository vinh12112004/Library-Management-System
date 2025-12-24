using AutoMapper;
using backend.DTOs.Staff;
using backend.Interfaces;

namespace backend.Services.Staff;

public class StaffService : IStaffService
{
    private readonly IStaffRepository _staffRepository;
    private readonly IMapper _mapper;

    public StaffService(IStaffRepository staffRepository, IMapper mapper)
    {
        _staffRepository = staffRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<StaffDto>> GetAllStaffsAsync()
    {
        var staffs = await _staffRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<StaffDto>>(staffs);
    }

    public async Task<StaffDto?> GetStaffByIdAsync(int id)
    {
        var staff = await _staffRepository.GetByIdAsync(id);
        return staff == null ? null : _mapper.Map<StaffDto>(staff);
    }

    public async Task<bool> UpdateStaffAsync(int id, UpdateStaffDto updateStaffDto)
    {
        var staff = await _staffRepository.GetByIdAsync(id);
        if (staff == null)
        {
            return false;
        }

        _mapper.Map(updateStaffDto, staff);
        await _staffRepository.UpdateAsync(staff);

        return true;
    }

    public async Task<bool> DeleteStaffAsync(int id)
    {
        var staff = await _staffRepository.GetByIdAsync(id);
        if (staff == null)
        {
            return false;
        }

        await _staffRepository.DeleteAsync(id);
        return true;
    }
}