using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTOs.Member;

public class MemberDto
{
    public int MemberId { get; set; }
    public string MemberCode { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Address { get; set; }
    public string DateOfBirth { get; set; }
    public string IdCard { get; set; }
    public MembershipType MembershipType { get; set; }
    public DateTime RegistrationDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public MemberStatus Status { get; set; }
}

public class UpdateMemberDto
{
    [Required]
    [MaxLength(255)]
    public string FullName { get; set; }

    [MaxLength(100)]
    public string Email { get; set; }

    [MaxLength(20)]
    public string Phone { get; set; }

    public string Address { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(20)]
    public string IdCard { get; set; }

    public MembershipType MembershipType { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public MemberStatus Status { get; set; }
}