using backend.DTOs.Staff;
using backend.Services.Staff;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StaffController : ControllerBase
{
    private readonly IStaffService _staffService;

    public StaffController(IStaffService staffService)
    {
        _staffService = staffService;
    }

    // GET: api/Staff
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaffs()
    {
        var staffs = await _staffService.GetAllStaffsAsync();
        return Ok(staffs);
    }

    // GET: api/Staff/5
    [HttpGet("{id}")]
    public async Task<ActionResult<StaffDto>> GetStaff(int id)
    {
        var staffDto = await _staffService.GetStaffByIdAsync(id);

        if (staffDto == null)
        {
            return NotFound();
        }

        return Ok(staffDto);
    }

    // PUT: api/Staff/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStaff(int id, UpdateStaffDto updateStaffDto)
    {
        var wasUpdated = await _staffService.UpdateStaffAsync(id, updateStaffDto);
        if (!wasUpdated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Staff/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStaff(int id)
    {
        var wasDeleted = await _staffService.DeleteStaffAsync(id);
        if (!wasDeleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}