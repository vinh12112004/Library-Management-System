namespace backend.DTOs;

public class ConversationDto
{
    public int Id { get; set; }
    public int ReaderId { get; set; }
    public string ReaderName { get; set; }
    public string LastMessage { get; set; }
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
}

public class MessageDto
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public int SenderId { get; set; }
    public string SenderType { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SendMessageDto
{
    public int ConversationId { get; set; }
    public string Content { get; set; }
}