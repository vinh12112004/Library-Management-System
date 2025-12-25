using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using backend.DTOs;
using backend.Interfaces;
using backend.Services.Chat;
using Microsoft.AspNetCore.Authorization;

namespace backend.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        // Reader hoặc Staff gửi message
        public async Task SendMessage(SendMessageDto messageDto)
        {
            try
            {
                var accountId = int.Parse(
                    Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                    ?? throw new HubException("User claim missing")
                );

                var role = Context.User.FindFirst(ClaimTypes.Role)?.Value ?? "Reader";
                Console.WriteLine(role);
                var message = await _chatService.SendMessageAsync(accountId, role, messageDto);

                await Clients.Group($"Conversation_{messageDto.ConversationId}")
                    .SendAsync("ReceiveMessage", message);
            }
            catch (Exception ex)
            {
                // Gửi lỗi rõ cho client
                throw new HubException(ex.Message);
            }
        }


        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
        }

        public async Task LeaveConversation(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
        }
    }
}