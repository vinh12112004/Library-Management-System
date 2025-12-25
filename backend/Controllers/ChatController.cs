using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Services.Chat;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        // GET: api/Chat/conversations
        [HttpGet("conversations")]
        public async Task<ActionResult<IEnumerable<ConversationDto>>> GetConversations()
        {
            var conversations = await _chatService.GetAllConversationsAsync();
            return Ok(conversations);
        }

        // GET: api/Chat/conversations/5
        [HttpGet("conversations/{id}")]
        public async Task<ActionResult<ConversationDto>> GetConversation(int id)
        {
            var conversation = await _chatService.GetConversationByIdAsync(id);

            if (conversation == null)
            {
                return NotFound();
            }

            return Ok(conversation);
        }

        // GET: api/Chat/conversations/reader/5
        [HttpGet("conversations/me")]
        public async Task<ActionResult<ConversationDto>> GetOrCreateConversation()
        {
            var accountId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var conversation = await _chatService.GetOrCreateConversationAsync(accountId);
            return Ok(conversation);
        }

        // GET: api/Chat/conversations/5/messages
        [HttpGet("conversations/{conversationId}/messages")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages(int conversationId)
        {
            var messages = await _chatService.GetMessagesByConversationIdAsync(conversationId);
            return Ok(messages);
        }

        // POST: api/Chat/messages
        [HttpPost("messages")]
        public async Task<ActionResult<MessageDto>> SendMessage(SendMessageDto sendMessageDto)
        {
            var accountId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Reader";

            var message = await _chatService.SendMessageAsync(accountId, userRole, sendMessageDto);
            return CreatedAtAction(nameof(GetMessages), new { conversationId = message.ConversationId }, message);
        }
    }
}