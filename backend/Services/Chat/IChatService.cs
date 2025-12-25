using backend.DTOs;

namespace backend.Services.Chat;

public interface IChatService
{
    Task<IEnumerable<ConversationDto>> GetAllConversationsAsync();
    Task<ConversationDto?> GetConversationByIdAsync(int id);
    Task<ConversationDto?> GetOrCreateConversationAsync(int readerId);
    Task<IEnumerable<MessageDto>> GetMessagesByConversationIdAsync(int conversationId);
    Task<MessageDto> SendMessageAsync(int senderId, string senderType, SendMessageDto sendMessageDto);
}