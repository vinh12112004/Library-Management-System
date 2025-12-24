using backend.Models;

namespace backend.Services
{
    public interface ITokenService
    {
        (string token, DateTime expiresAt) CreateToken(
            Account account,
            IEnumerable<string> roles
        );
    }
}