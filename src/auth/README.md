# JWT Authentication Setup

This module provides JWT-based authentication using Passport.js for the NestJS application with support for both header-based and cookie-based authentication.

## Features

- JWT token generation and validation
- User signup and signin with JWT tokens
- **Dual authentication support**: JWT tokens via Authorization header OR HTTP-only cookies
- Protected routes using multiple authentication strategies
- User profile extraction from JWT tokens
- Secure cookie-based session management

## Environment Variables

Make sure to set the following environment variables:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
NODE_ENV=production  # For secure cookie settings in production
```

## Authentication Strategies

### 1. JWT Header Authentication (Original)

- Uses `Authorization: Bearer <token>` header
- Suitable for API clients, mobile apps, and SPA applications
- Strategy name: `jwt`

### 2. JWT Cookie Authentication (New)

- Uses HTTP-only cookies for token storage
- Suitable for traditional web applications
- Strategy name: `jwt-cookie`
- Cookie name: `access_token`

### 3. Combined Authentication

- Tries both strategies (header first, then cookie)
- Provides maximum flexibility for different client types

## Usage

### Authentication Endpoints

- `POST /signup` - Register a new user and receive JWT token
- `POST /signin` - Login with credentials and receive JWT token + set HTTP-only cookie
- `POST /logout` - Clear authentication cookie

### Protected Endpoints

#### Header Authentication Only

- `GET /users/:id` - Get user by ID (requires JWT token in header)

#### Cookie Authentication Only

- `GET /users-cookie-only/:id` - Get user by ID (requires JWT token in cookie)

#### Combined Authentication (Header OR Cookie)

- `GET /users` - Get all users (accepts JWT token from header OR cookie)

### Using JWT Token

#### Option 1: Authorization Header

```
Authorization: Bearer <your-jwt-token>
```

#### Option 2: HTTP-Only Cookie

The cookie is automatically set when you login via `/signin` endpoint and sent with subsequent requests.

### Example Usage in Controllers

#### Header Authentication Only

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('/header-only')
async headerOnlyRoute() {
  return { message: 'Authenticated via header' };
}
```

#### Cookie Authentication Only

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';

@UseGuards(JwtCookieAuthGuard)
@Get('/cookie-only')
async cookieOnlyRoute() {
  return { message: 'Authenticated via cookie' };
}
```

#### Combined Authentication (Header OR Cookie)

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtCombinedAuthGuard } from './guards/jwt-combined-auth.guard';

@UseGuards(JwtCombinedAuthGuard)
@Get('/flexible')
async flexibleRoute() {
  return { message: 'Authenticated via header OR cookie' };
}
```

## Cookie Configuration

The authentication cookie is configured with the following security settings:

```typescript
response.cookie('access_token', authResponse.accessToken, {
  httpOnly: true, // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  maxAge: 3600000 * 8, // 8 hours expiration
});
```

## Files Structure

### Strategies

- `strategies/jwt.strategy.ts` - JWT validation strategy (header-based)
- `strategies/jwt-cookie.strategy.ts` - JWT validation strategy (cookie-based)

### Guards

- `guards/jwt-auth.guard.ts` - JWT authentication guard (header only)
- `guards/jwt-cookie-auth.guard.ts` - JWT authentication guard (cookie only)
- `guards/jwt-combined-auth.guard.ts` - Combined authentication guard (header OR cookie)

### Other Files

- `decorators/get-user.decorator.ts` - Decorator to extract user from request
- `dto/auth-response.dto.ts` - Response DTO for authentication endpoints

## Security Considerations

1. **HTTP-Only Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
2. **Secure Flag**: Ensures cookies are only sent over HTTPS in production
3. **SameSite Protection**: Consider adding `sameSite: 'strict'` for additional CSRF protection
4. **Token Expiration**: Both header and cookie tokens respect the same JWT expiration time

## Migration Guide

If you're upgrading from header-only authentication:

1. **No Breaking Changes**: Existing header-based authentication continues to work
2. **Gradual Migration**: Use `JwtCombinedAuthGuard` for routes that need to support both methods
3. **Frontend Updates**: Update your frontend to handle cookie-based authentication for better UX
