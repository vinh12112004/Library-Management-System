using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Account
{
    [Key]
    public int AccountId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; }

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public virtual ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();

}

public class AccountRole
{
    [Key]
    public int AccountRoleId { get; set; }

    public int AccountId { get; set; }
    public RoleType Role { get; set; }

    public virtual Account Account { get; set; }
}