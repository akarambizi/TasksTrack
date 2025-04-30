using System;
using System.Threading.Tasks;
using TasksTrack.Models;
using TasksTrack.Repositories;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace TasksTrack.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly string _jwtSecret;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _jwtSecret = configuration["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret", "JWT secret cannot be null.");
        }

        // Email regex: Validates format like example@domain.com
        private bool ValidateEmail(string email)
        {
            var emailRegex = new System.Text.RegularExpressions.Regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
            return emailRegex.IsMatch(email);
        }

        // Password regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        private bool ValidatePassword(string password)
        {
            // Separate regex into readable parts
            var passwordRegex = new System.Text.RegularExpressions.Regex(
                "^" +
                "(?=.*[a-z])" + // At least one lowercase letter
                "(?=.*[A-Z])" + // At least one uppercase letter
                "(?=.*\\d)" +  // At least one digit
                "(?=.*[!@#$%^&*])" + // At least one special character
                "[A-Za-z\\d!@#$%^&*]{8,}" + // Minimum 8 characters
                "$"
            );

            var isValid = passwordRegex.IsMatch(password);
            return isValid;
        }

        public async Task<AuthResult> RegisterAsync(RegisterRequest request)
        {
            if (!ValidateEmail(request.Email))
            {
                return new AuthResult { Success = false, Message = "Invalid email format. Please provide a valid email in the format: example@domain.com." };
            }

            if (!ValidatePassword(request.Password))
            {
                return new AuthResult { Success = false, Message = "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character." };
            }

            // Check if user exists
            var existingUser = await _authRepository.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return new AuthResult { Success = false, Message = "Email is already taken." };
            }

            // Check if username exists
            var existingUsername = await _authRepository.GetUserByUsernameAsync(request.Username);
            if (existingUsername != null)
            {
                return new AuthResult { Success = false, Message = "Username is already taken." };
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create user
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            await _authRepository.CreateUserAsync(user);

            // Generate JWT
            var token = this.GenerateJwtToken(user);

            return new AuthResult { Success = true, Token = token ?? string.Empty, Message = "User registered successfully." };
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            if (!ValidateEmail(request.Email))
            {
                return new AuthResult { Success = false, Message = "Invalid email format. Please provide a valid email in the format: example@domain.com." };
            }

            // Get user by email
            var user = await _authRepository.GetUserByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResult { Success = false, Message = "Invalid credentials." };
            }

            // Generate JWT
            var token = this.GenerateJwtToken(user);

            return new AuthResult { Success = true, Token = token ?? string.Empty, Message = "Login successful." };
        }

        public async Task<AuthResult> ResetPasswordAsync(PasswordResetRequest request)
        {
            // Get user by email
            var user = await _authRepository.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthResult { Success = false, Message = "User not found." };
            }

            // Hash new password
            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.PasswordHash = newPasswordHash;

            await _authRepository.UpdateUserAsync(user);

            return new AuthResult { Success = true, Message = "Password reset successfully." };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public Task<AuthResult> ValidateTokenAsync(TokenRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return Task.FromResult(new AuthResult { Success = false, Message = "Token is required." });
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecret);
                tokenHandler.ValidateToken(request.Token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Task.FromResult(new AuthResult { Success = true, Message = "Token is valid." });
            }
            catch (Exception ex)
            {
                return Task.FromResult(new AuthResult { Success = false, Message = $"Invalid token: {ex.Message}" });
            }
        }
    }
}