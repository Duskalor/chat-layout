# Design: clean-code-backend

## Technical Approach

This design addresses security vulnerabilities and technical debt in the backend by implementing environment-based configuration, JWT authentication, input validation, global error handling, and a modular structure. The approach follows a "security first" philosophy, then refactors the monolithic `index.ts` into clean modular layers following Express.js best practices.

## Architecture Decisions

### Decision: Modular Structure with Layered Architecture

**Choice**: Split backend into `config/`, `types/`, `middleware/`, `services/`, and `routes/` directories

**Alternatives considered**:
- Keep all code in single file with internal organization
- Use a domain-driven structure (e.g., `features/auth/`, `features/chat/`)

**Rationale**: Express.js community standard pattern that separates concerns logically. Each layer has a single responsibility:
- `config/` - Environment loading and validation
- `types/` - TypeScript interfaces shared across the app
- `middleware/` - Cross-cutting concerns (auth, validation, errors)
- `services/` - Business logic and data operations
- `routes/` - HTTP endpoint definitions

---

### Decision: Valibot for Input Validation

**Choice**: Use `valibot` library for runtime schema validation

**Alternatives considered**:
- `zod` - Good but larger bundle size
- `joi` - Older, more verbose
- `express-validator` - Middleware-focused, less intuitive

**Rationale**: Valibot is lightweight (~1.5KB), has TypeScript-first schema inference, and is already used in the frontend project (per project guidelines). Using Valibot keeps dependencies consistent across the monorepo.

---

### Decision: JWT with jsonwebtoken

**Choice**: Use `jsonwebtoken` library for JWT operations

**Alternatives considered**:
- `jose` - More modern, but jsonwebtoken has better ecosystem support
- Custom token implementation - Security risk

**Rationale**: `jsonwebtoken` is battle-tested, has excellent TypeScript types, and is widely used in the Node.js ecosystem.

---

### Decision: bcrypt with Work Factor 10

**Choice**: Use `bcrypt` with default work factor (10)

**Alternatives considered**:
- Argon2 - More memory-hard but slower, less ecosystem support
- scrypt - Native but requires more setup
- PBKDF2 - NIST approved but bcrypt is more common

**Rationale**: bcrypt is the Node.js standard with excellent library support. Work factor 10 provides good security without excessive CPU overhead.

---

### Decision: Async Wrapper for Route Handlers

**Choice**: Create a higher-order function that wraps async route handlers to catch rejections

**Alternatives considered**:
- Manual try/catch in every handler - Verbose, error-prone
- Express 5 native async support - Not yet stable

**Rationale**: Express doesn't automatically catch async errors. This wrapper ensures all async route errors are passed to the error middleware.

---

### Decision: Global Error Middleware with Custom Error Classes

**Choice**: Implement custom error classes and a centralized error-handling middleware

**Alternatives considered**:
- Handle errors in each route - Duplication, inconsistent responses
- Use only try/catch in controllers - Doesn't catch all errors

**Rationale**: Centralized error handling ensures consistent error responses, proper HTTP status codes, and prevents server crashes from unhandled errors.

---

## Data Flow

### Request Flow Diagram

```
Client Request
      │
      ▼
┌─────────────────┐
│  CORS Middleware│ ─── Checks origin against CORS_ORIGIN
└────────┬────────┘
      │
      ▼
┌─────────────────┐
│  Express.json() │ ─── Parse request body
└────────┬────────┘
      │
      ▼
┌─────────────────┐
│ Validation      │ ─── Valibot schemas validate input
│ Middleware      │     (if route has validation)
└────────┬────────┘
      │
      ▼
┌─────────────────┐
│ Auth Middleware │ ─── JWT validation (protected routes)
│ (optional)      │
└────────┬────────┘
      │
      ▼
┌─────────────────┐
│ Route Handler   │ ─── Business logic via services
└────────┬────────┘
      │
      ▼
┌─────────────────┐
│ Response        │ ─── JSON response to client
└─────────────────┘
```

### Authentication Sequence Diagram

```
Client                    Server                    JWT
 │                         │                        │
 │  POST /auth/login       │                        │
 │  {email, password}     │                        │
 │───────────────────────>│                        │
 │                         │                        │
 │                   Validate Input (Valibot)          │
 │                         │                        │
 │                   Find User by Email             │
 │                         │                        │
 │                   bcrypt.compare(password)       │
 │                         │                        │
 │                   Generate JWT Token             │
 │                         │<───────────────────────│
 │                         │                        │
 │  {token, user}         │                        │
 │<───────────────────────│                        │
 │                         │                        │
```

### Socket.io Authentication Sequence

```
Client              Socket.io Server         JWT
 │                         │                   │
 │  connect(token)         │                   │
 │───────────────────────>│                   │
 │                         │                   │
 │                   Verify JWT                │
 │                   from auth header          │
 │                         │<───────────────────│
 │                         │                   │
 │              If valid: store user in        │
 │              socket.data.user               │
 │                         │                   │
 │  connection_success    │                    │
 │<───────────────────────│                    │
 │                         │                   │
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/.env` | Create | Environment variables template |
| `backend/.env.example` | Create | Environment variables documentation |
| `backend/src/config/index.ts` | Create | Environment loading and validation |
| `backend/src/config/cors.ts` | Create | CORS configuration helper |
| `backend/src/types/index.ts` | Create | All TypeScript interfaces |
| `backend/src/types/errors.ts` | Create | Custom error classes |
| `backend/src/middleware/error.ts` | Create | Global error handling middleware |
| `backend/src/middleware/auth.ts` | Create | JWT authentication middleware |
| `backend/src/middleware/validate.ts` | Create | Valibot validation middleware |
| `backend/src/middleware/async.ts` | Create | Async wrapper for route handlers |
| `backend/src/services/auth.service.ts` | Create | Login/logout business logic |
| `backend/src/services/user.service.ts` | Create | User data operations |
| `backend/src/services/chat.service.ts` | Create | Chat/message operations |
| `backend/src/routes/auth.routes.ts` | Create | Auth HTTP endpoints |
| `backend/src/routes/index.ts` | Create | Main router configuration |
| `backend/src/index.ts` | Modify | Entry point, now minimal |
| `backend/package.json` | Modify | Add dependencies: valibot, bcrypt, jsonwebtoken, dotenv |

## Interfaces / Contracts

### Configuration Interface

```typescript
// backend/src/config/index.ts
interface AppConfig {
  port: number;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

function loadConfig(): AppConfig {
  // Load from process.env with validation
}
```

### Data Models

```typescript
// backend/src/types/index.ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    createdAt: string;
    senderId: string;
    text: string;
  };
}
```

### Auth Payloads

```typescript
// backend/src/types/index.ts
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: Omit<User, 'password'>;
  token: string;
  chats: Chat[];
}

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
```

### Validation Schemas

```typescript
// backend/src/middleware/validate.ts
import { object, string, minLength, email } from 'valibot';

const loginSchema = object({
  email: string([email('Invalid email format')]),
  password: string([minLength(1, 'Password is required')]),
});

const messageSchema = object({
  id: string(),
  chatId: string([minLength(1, 'chatID is required')]),
  senderId: string(),
  text: string([minLength(1, 'Text is required')]),
});
```

### Error Classes

```typescript
// backend/src/types/errors.ts
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Valibot schemas, auth middleware, error classes | Jest with mocked req/res |
| Integration | API endpoints with TestClient | Supertest |
| E2E | Full auth flow, protected routes | Manual or Cypress |

**Testing Dependencies to Add**:
- `jest`, `@types/jest`, `ts-jest` - Unit testing
- `supertest` - API integration testing

## Migration / Rollout

### Phase 1: Infrastructure (No breaking changes)
1. Add new dependencies to package.json
2. Create `config/` module with .env loading
3. Create type definitions with consistent `createdAt`
4. Create custom error classes

### Phase 2: Middleware (No breaking changes)
1. Implement error handling middleware
2. Implement async wrapper
3. Implement JWT auth middleware
4. Implement Valibot validation middleware

### Phase 3: Services & Routes (Breaking changes)
1. Create auth service with bcrypt + JWT
2. Create route handlers using new services
3. Update main index.ts to use new structure

### Phase 4: Socket.io Integration
1. Add JWT authentication to Socket.io
2. Validate message payloads with Valibot

### Rollback Plan
1. Revert `backend/src/index.ts` from backup
2. Remove created directories: config/, types/, middleware/, services/, routes/
3. Revert package.json to remove added dependencies

## Open Questions

- [ ] Should we implement user registration, or only authenticate existing users?
- [ ] Should JWT tokens be stored in HTTP-only cookies instead of returned to client?
- [ ] Should we implement token refresh functionality?
- [ ] How to handle password hashing for existing mock users - re-hash on startup or keep plain-text for migration?
