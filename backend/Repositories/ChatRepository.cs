using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly LibraryDbContext _context;

        public ChatRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Conversation>> GetAllConversationsAsync()
        {
            return await _context.Conversations
                .Include(c => c.Reader)
                .Include(c => c.Messages)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Conversation?> GetConversationByIdAsync(int id)
        {
            return await _context.Conversations
                .Include(c => c.Reader)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Conversation?> GetConversationByReaderIdAsync(int readerId)
        {
            return await _context.Conversations
                .Include(c => c.Reader)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.ReaderId == readerId);
        }

        public async Task<Conversation> CreateConversationAsync(Conversation conversation)
        {
            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
            return conversation;
        }

        public async Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId)
        {
            return await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<Message> AddMessageAsync(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }
    }
}