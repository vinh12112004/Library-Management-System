using AutoMapper;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;

namespace backend.Services.Chat;

public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IMapper _mapper;

        public ChatService(IChatRepository chatRepository, IMapper mapper, IMemberRepository memberRepository)
        {
            _chatRepository = chatRepository;
            _mapper = mapper;
            _memberRepository = memberRepository;
        }

        public async Task<IEnumerable<ConversationDto>> GetAllConversationsAsync()
        {
            var conversations = await _chatRepository.GetAllConversationsAsync();
            
            return conversations.Select(c => new ConversationDto
            {
                Id = c.Id,
                ReaderId = c.ReaderId,
                ReaderName = c.Reader.FullName,
                LastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.Content ?? "",
                LastMessageTime = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt ?? c.CreatedAt,
                UnreadCount = 0 // TODO: Implement unread count logic
            });
        }

        public async Task<ConversationDto?> GetConversationByIdAsync(int id)
        {
            var conversation = await _chatRepository.GetConversationByIdAsync(id);
            if (conversation == null) return null;

            return new ConversationDto
            {
                Id = conversation.Id,
                ReaderId = conversation.ReaderId,
                ReaderName = conversation.Reader.FullName,
                LastMessage = conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.Content ?? "",
                LastMessageTime = conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt ?? conversation.CreatedAt,
                UnreadCount = 0
            };
        }

        public async Task<ConversationDto?> GetOrCreateConversationAsync(int userId)
        {
            int readerId = await _memberRepository.GetMemberIdByAccountIdAsync(userId);
            var conversation = await _chatRepository.GetConversationByReaderIdAsync(readerId);
            
            if (conversation == null)
            {
                conversation = await _chatRepository.CreateConversationAsync(new Conversation
                {
                    ReaderId = readerId,
                    CreatedAt = DateTime.UtcNow
                });
            }

            return await GetConversationByIdAsync(conversation.Id);
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesByConversationIdAsync(int conversationId)
        {
            var messages = await _chatRepository.GetMessagesByConversationIdAsync(conversationId);
            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<MessageDto> SendMessageAsync(int senderId, string senderType, SendMessageDto sendMessageDto)
        {
            var message = new Message
            {
                ConversationId = sendMessageDto.ConversationId,
                SenderId = senderId,
                SenderType = senderType.ToLower() == "reader" ? MessageSender.Reader : MessageSender.Staff,
                Content = sendMessageDto.Content,
                CreatedAt = DateTime.UtcNow
            };

            var newMessage = await _chatRepository.AddMessageAsync(message);
            return _mapper.Map<MessageDto>(newMessage);
        }
    }