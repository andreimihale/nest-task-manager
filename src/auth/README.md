# JWT Authentication Setup

This module provides JWT-based authentication using Passport.js for the NestJS application.

## Features

- JWT token generation and validation
- User signup and signin with JWT tokens
- Protected routes using JWT authentication guard
- User profile extraction from JWT tokens

## Environment Variables

Make sure to set the following environment variables:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

## Usage

### Authentication Endpoints

- `POST /signup` - Register a new user and receive JWT token
- `POST /signin` - Login with credentials and receive JWT token

### Protected Endpoints

- `GET /profile` - Get current user profile (requires JWT token)
- `GET /users` - Get all users (requires JWT token)
- `GET /users/:id` - Get user by ID (requires JWT token)

### Using JWT Token

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Usage in Controllers

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Get('/protected-route')
async protectedRoute(@GetUser() user: User) {
  // user is automatically extracted from JWT token
  return { message: `Hello ${user.username}` };
}
```

## Files Structure

- `strategies/jwt.strategy.ts` - JWT validation strategy
- `guards/jwt-auth.guard.ts` - JWT authentication guard
- `decorators/get-user.decorator.ts` - Decorator to extract user from request
- `dto/auth-response.dto.ts` - Response DTO for authentication endpoints
