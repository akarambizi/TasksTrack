# Authentication Design

## Objective

The objective of this document is to outline the design of the authentication system for the task tracking application.

### Requirements

1. Users should be able to register with the system.
2. Registered users should be able to log in with their credentials.
3. Authentication should be secure and use industry-standard practices.
4. Users should be able to reset their password if they forget it.
5. The system should provide tokens for authenticated users to access protected resources.

### Authentication Flow

#### User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**

```json
{
  "username": "example_user",
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response:**
- `200 OK` on successful registration
- `400 Bad Request` if the username or email is already taken

```mermaid
graph TD;
    Start((Start)) --> UserRegistration[User Registration]
    UserRegistration -->|User Details| ValidateUserDetails[Validate User Details]
    ValidateUserDetails -->|Valid| CheckUserExists[Check if User Exists]
    CheckUserExists -->|Exists| ReturnError[User Already Exists]
    CheckUserExists -->|Not Exists| CreateUser[Create User]
    CreateUser -->|Success| GenerateJWT[Generate JWT]
    GenerateJWT --> SendJWT[Send JWT to User]
    CreateUser -->|Failure| ReturnError2[Failed to Create User]
    ValidateUserDetails -->|Invalid| ReturnError3[Invalid User Details]
```

#### User Login

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response:**
- `200 OK` on successful login
- `401 Unauthorized` if the credentials are incorrect

```mermaid
graph TD;
    Start((Start)) --> UserLogin[User Login]
    UserLogin -->|User Credentials| ValidateUserCredentials[Validate User Credentials]
    ValidateUserCredentials -->|Valid| GenerateJWT[Generate JWT]
    GenerateJWT --> SendJWT[Send JWT to User]
    ValidateUserCredentials -->|Invalid| ReturnError[Invalid Credentials]
```

#### Password Reset

- **Endpoint:** `/api/auth/reset-password`
- **Method:** `POST`
- **Request Body:**

``` json
{
  "email": "user@example.com"
}
```

- **Response:**
- `200 OK` if the password reset email is sent successfully
- `404 Not Found` if the email is not associated with any user account

```mermaid
graph TD;
    Start((Start)) --> PasswordReset[Password Reset]
    PasswordReset -->|User Email| SendResetEmail[Send Reset Email]
    SendResetEmail -->|Success| ReturnSuccess[Return Success]
    SendResetEmail -->|Failure| ReturnError[User Not Found]
```

#### Token Generation

- JWT (JSON Web Token) will be used for token-based authentication.
- Tokens will be generated upon successful login and sent back to the client.
- The token should be sent in the Authorization header of subsequent requests.

### Security Measures

#### Password Hashing

- User passwords will be hashed using a strong hashing algorithm before storing them in the database.
- `BCrypt` will be used for password hashing.

```mermaid
graph TD;
    Start((Start)) --> PasswordHashing[Password Hashing]
    PasswordHashing -->|Strong Hashing Algorithm| HashPassword[Hash Password]
    HashPassword -->|BCrypt| StoreHashedPassword[Store Hashed Password]
```

#### JWT (JSON Web Token)

- Tokens will be signed using a secure key.
- Tokens will have an expiry time.
- Tokens will be transmitted securely over HTTPS.

```mermaid
graph TD;
    Start((Start)) --> TokenGeneration[Token Generation]
    TokenGeneration -->|Sign with Secure Key| SignToken[Sign Token]
    SignToken -->|Expiry Time| SetTokenExpiry[Set Token Expiry]
    SetTokenExpiry -->|HTTPS| TransmitToken[Transmit Token]
```

### Database Schema

#### User Table

- **Fields:**
- `id` (Primary Key)
- `username`
- `email`
- `password_hash`

### Technology Stack

- **Framework:** ASP.NET
- **Database:** PostgreSQL Server
- **Authentication:** JWT

### Future Enhancements

#### Rate Limiting

Add rate limiting to the login endpoint to protect against brute-force attacks. This will limit the number of login attempts a user can make within a certain time period, reducing the risk of an attacker guessing a user's password through repeated attempts.

#### Password Policy

Enforce a strong password policy for better security. This policy will require passwords to be a certain length and include a mix of uppercase and lowercase letters, numbers, and special characters.


#### Refresh Tokens

 Implement refresh tokens for maintaining user sessions with short-lived access tokens. A refresh token can be used to get a new access token when the old one expires, without requiring the user to log in again. This provides a balance between security and user convenience.

#### Email Verification

Add email verification after registration to confirm the user's email address.
