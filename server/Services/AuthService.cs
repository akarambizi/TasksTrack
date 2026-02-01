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

            // Generate tokens
            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {
            if (!ValidateEmail(request.Email))
            {
                return new AuthResult { Success = false, Message = "Invalid email format. Please provide a valid email in the format: example@domain.com." };
            }

            // Get user by email (case-insensitive search)
            var user = await _authRepository.GetUserByEmailAsync(request.Email);

            if (user == null)
            {
                return new AuthResult { Success = false, Message = "Invalid credentials." };
            }

            var passwordVerified = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!passwordVerified)
            {
                return new AuthResult { Success = false, Message = "Invalid credentials." };
            }

            // Generate tokens
            return await GenerateTokensAsync(user);
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

        public async Task<AuthResult> RefreshTokenAsync(RefreshTokenRequest request)
        {
            // Hash the refresh token before searching (since we store hashed tokens)
            var hashedRefreshToken = HashRefreshToken(request.RefreshToken);
            var user = await _authRepository.GetUserByRefreshTokenAsync(hashedRefreshToken);

            if (user == null)
            {
                return new AuthResult { Success = false, Message = "Invalid refresh token." };
            }

            // Check if refresh token is expired
            if (user.RefreshTokenExpiry == null || user.RefreshTokenExpiry <= DateTimeOffset.UtcNow)
            {
                return new AuthResult { Success = false, Message = "Refresh token has expired." };
            }

            // Generate new tokens (refresh token rotation - new refresh token on each use)
            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResult> LogoutAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return new AuthResult { Success = true, Message = "Logout successful." };
            }

            // Hash the refresh token before searching (since we store hashed tokens)
            var hashedRefreshToken = HashRefreshToken(refreshToken);
            var user = await _authRepository.GetUserByRefreshTokenAsync(hashedRefreshToken);

            if (user == null)
            {
                return new AuthResult { Success = true, Message = "Logout successful." };
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            await _authRepository.UpdateUserAsync(user);

            return new AuthResult { Success = true, Message = "Logout successful." };
        }

        private string GenerateJwtToken(User user, DateTimeOffset expirationTime)
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
                Expires = expirationTime.DateTime, // Convert DateTimeOffset to DateTime for JWT
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            // Generate a secure random refresh token
            var randomBytes = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private string HashRefreshToken(string refreshToken)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA256();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            hmac.Key = key;
            var hashBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(refreshToken));
            return Convert.ToBase64String(hashBytes);
        }

        private async Task<AuthResult> GenerateTokensAsync(User user)
        {
            // Use consistent timestamp for both tokens to prevent timing attacks
            var now = DateTimeOffset.UtcNow;
            var jwtExpiry = now.AddHours(1);
            var refreshTokenExpiry = now.AddDays(7); // 7 days expiry

            var accessToken = GenerateJwtToken(user, jwtExpiry);
            var refreshToken = GenerateRefreshToken();

            // Update user with hashed refresh token (store hash, return plaintext)
            user.RefreshToken = HashRefreshToken(refreshToken);
            user.RefreshTokenExpiry = refreshTokenExpiry;
            await _authRepository.UpdateUserAsync(user);

            return new AuthResult
            {
                Success = true,
                Token = accessToken,
                RefreshToken = refreshToken,
                TokenExpiry = DateTimeOffset.UtcNow.AddHours(1),
                RefreshTokenExpiry = refreshTokenExpiry,
                UserId = user.Id.ToString(),
                UserEmail = user.Email,
                Message = "Tokens generated successfully."
            };
        }
    }
}