namespace backend.Models;

public class Conversation
{
    public int Id { get; set; }

    public int ReaderId { get; set; }
    public Member Reader { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Message> Messages { get; set; }
}