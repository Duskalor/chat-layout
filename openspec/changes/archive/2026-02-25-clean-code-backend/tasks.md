# Tasks: clean-code-backend

## Phase 1: Infrastructure (Foundation)

- [x] 1.1 Install dependencies: `pnpm add valibot bcrypt jsonwebtoken dotenv cors` in backend/
- [x] 1.2 Install dev dependencies: `pnpm add -D @types/bcrypt @types/jsonwebtoken` in backend/
- [x] 1.3 Create `backend/.env` with `JWT_SECRET=your-secret-key` and `CORS_ORIGIN=http://localhost:5173`
- [x] 1.4 Create `backend/.env.example` documenting required environment variables
- [x] 1.5 Create `backend/src/config/index.ts` with environment loading and AppConfig interface
- [x] 1.6 Create `backend/src/types/index.ts` with User, Message, Chat, LoginRequest, LoginResponse interfaces (use `createdAt` consistently)
- [x] 1.7 Create `backend/src/types/errors.ts` with AppError, ValidationError, UnauthorizedError, NotFoundError classes

## Phase 2: Middleware Implementation

- [x] 2.1 Create `backend/src/middleware/async.ts` - async wrapper to catch rejections and pass to next()
- [x] 2.2 Create `backend/src/middleware/error.ts` - global error handling middleware
- [x] 2.3 Create `backend/src/middleware/auth.ts` - JWT authentication middleware for protected routes
- [x] 2.4 Create `backend/src/middleware/validate.ts` - Valibot validation middleware with loginSchema and messageSchema

## Phase 3: Services (Business Logic)

- [x] 3.1 Create `backend/src/services/user.service.ts` - find user by email, get user by id
- [x] 3.2 Create `backend/src/services/auth.service.ts` - login with bcrypt.compare, JWT token generation
- [x] 3.3 Create `backend/src/services/chat.service.ts` - get user chats, generate mock chats

## Phase 4: Routes & Wiring

- [x] 4.1 Create `backend/src/routes/auth.routes.ts` - POST /auth/login with Valibot validation, POST /auth/logout
- [x] 4.2 Create `backend/src/routes/index.ts` - main router configuration
- [x] 4.3 Refactor `backend/src/index.ts` - use dotenv, modular structure, CORS from config, add error middleware
- [x] 4.4 Create `backend/src/controllers/auth.controller.ts` - Handle login/logout HTTP requests, call services, return responses

## Phase 5: Socket.io Integration

- [x] 5.1 Add JWT authentication middleware to Socket.io in `backend/src/index.ts`
- [x] 5.2 Add Valibot validation for sendMessage event payload in Socket.io handler

## Phase 6: Testing & Verification

- [x] 6.1 Verify backend runs: `cd backend && pnpm dev`
- [x] 6.2 Test: POST /auth/login with valid credentials returns JWT token (not mock string)
- [x] 6.3 Test: POST /auth/login with invalid email format returns 400 validation error
- [x] 6.4 Test: POST /auth/login with missing password returns 400 validation error
- [x] 6.5 Test: GET /nonexistent returns 404
- [ ] 6.6 Test: Request from disallowed origin is blocked by CORS
- [x] 6.7 Run type-check: `cd backend && pnpm build`
- [x] 6.8 Run lint: `cd frontend && pnpm lint` (if backend has lint)

## Phase 7: Cleanup

- [x] 7.1 Remove hardcoded passwords from source code (ensure all passwords are hashed or from .env)
- [x] 7.2 Remove non-null assertions (!) from TypeScript code
- [x] 7.3 Verify no mock JWT tokens (`jwt-token-${Date.now()}`) remain in code
