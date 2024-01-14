using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GamePortal.Service
{
  /* 
   * Source: https://code-maze.com/using-refresh-tokens-in-asp-net-core-authentication/
   */
  public class TokenService : ITokenService
  {
    private readonly IConfiguration _configuration;
    public TokenService(IConfiguration configuration)
    {
      _configuration = configuration;
    }
    public string GenerateToken(IEnumerable<Claim> claims)
    {
      var secretKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSettings").GetValue<string>("SecretKey")!)
      );
      var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
      var tokenOptions = new JwtSecurityToken(
          issuer: "http://localhost:5086",
          audience: "http://localhost:5086",
          claims: claims,
          expires: DateTime.Now.AddSeconds(10),
          signingCredentials: signingCredentials
      );

      var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

      return tokenString;
    }

    public string GenerateRefreshToken()
    {
      var random = new byte[32];
      using (var rng = RandomNumberGenerator.Create())
      {
        rng.GetBytes(random);
        return Convert.ToBase64String(random);
      }
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
      var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSettings").GetValue<string>("SecretKey")!));
      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateAudience = false,
        ValidateIssuer = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey.ToString())),
        ValidateLifetime = false
      };
      var tokenHandler = new JwtSecurityTokenHandler();
      SecurityToken securityToken;
      var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
      var jwtSecurityToken = securityToken as JwtSecurityToken;
      if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        throw new SecurityTokenException("Invalid token");
      return principal;
    }
  }
}
