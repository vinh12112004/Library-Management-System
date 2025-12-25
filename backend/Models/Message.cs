namespace backend.Models;

public class Message
{
    public int Id { get; set; }

    public int ConversationId { get; set; }
    public Conversation Conversation { get; set; }

    public int SenderId { get; set; }

    public MessageSender SenderType { get; set; }
    // Reader / Staff

    public string Content { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}