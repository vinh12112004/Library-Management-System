using backend.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public (string token, DateTime expiresAt) CreateToken(
            Account account,
            IEnumerable<string> roles
        )
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, account.AccountId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, account.Username),
                new Claim(ClaimTypes.NameIdentifier, account.AccountId.ToString())
            };

            // Add roles (RẤT QUAN TRỌNG cho [Authorize(Roles=...)])
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return GenerateJwt(claims);
        }

        private (string token, DateTime expiresAt) GenerateJwt(IEnumerable<Claim> claims)
        {
            var jwtSection = _config.GetSection("Jwt");

            var key = jwtSection.GetValue<string>("Key")
                      ?? throw new InvalidOperationException("JWT Key not configured");

            var issuer = jwtSection.GetValue<string>("Issuer");
            var audience = jwtSection.GetValue<string>("Audience");
            var expireMinutes = jwtSection.GetValue<int>("ExpireMinutes", 120);

            var signingKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)
            );

            var creds = new SigningCredentials(
                signingKey,
                SecurityAlgorithms.HmacSha256
            );

            var expires = DateTime.UtcNow.AddMinutes(expireMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return (jwt, expires);
        }
    }
}
