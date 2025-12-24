using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Staff;

public class StaffDto
{
    public int StaffId { get; set; }
    public string StaffCode { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public bool IsActive { get; set; }
    public RoleType Role { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateStaffDto
{
    [Required]
    [MaxLength(255)]
    public string FullName { get; set; }

    [MaxLength(20)]
    public string Phone { get; set; }
    
    public bool IsActive { get; set; }
}