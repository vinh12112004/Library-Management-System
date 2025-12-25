using backend.Models;

namespace backend.Interfaces
{
    public interface IChatRepository
    {
        Task<IEnumerable<Conversation>> GetAllConversationsAsync();
        Task<Conversation?> GetConversationByIdAsync(int id);
        Task<Conversation?> GetConversationByReaderIdAsync(int readerId);
        Task<Conversation> CreateConversationAsync(Conversation conversation);
        Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
        Task<Message> AddMessageAsync(Message message);
    }
}