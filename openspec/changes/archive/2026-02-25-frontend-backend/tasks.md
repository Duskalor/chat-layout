# Tasks: Frontend-Backend Integration

## Phase 1: Backend Verification

- [x] 1.1 Verify backend server runs on port 3000 (`cd backend && pnpm dev` or `bun dev`)
- [x] 1.2 Test backend login endpoint with curl: `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}'`
- [x] 1.3 Verify Socket.io is accepting connections on the same port

## Phase 2: Frontend Integration

- [x] 2.1 Modify `frontend/src/lib/auth-api.ts` - Replace `login()` mock implementation with fetch call to `POST /auth/login`
- [x] 2.2 Modify `frontend/src/lib/auth-api.ts` - Replace `logout()` mock implementation with fetch call to `POST /auth/logout`
- [x] 2.3 Remove unused mock data from `auth-api.ts` (MOCK_USERS array and generateMockChats function)
- [x] 2.4 Verify `frontend/src/lib/config.ts` points to `http://localhost:3000` (already correct)

## Phase 3: Socket.io Integration

- [x] 3.1 Verify `frontend/src/lib/socket-client.ts` connects to `config.URL` (already correct)
- [x] 3.2 Ensure socket emits `connected` event with userId on authentication success
- [x] 3.3 Ensure socket listens for `messages` and `new_message` events correctly

## Phase 4: Testing & Verification

- [x] 4.1 Start backend server (`cd backend && pnpm dev`)
- [x] 4.2 Start frontend dev server (`pnpm dev`)
- [x] 4.3 Test login flow: Login with `test@test.com` / `password123`
- [x] 4.4 Verify user is redirected to chat after successful login
- [x] 4.5 Test logout flow and verify user is redirected to login
- [x] 4.6 Test invalid credentials: Verify error message displays

## Phase 5: Error Handling & Polish

- [x] 5.1 Add loading state during authentication API calls
- [x] 5.2 Handle network errors gracefully (show user-friendly error messages)
- [x] 5.3 Run `pnpm lint` to check for any linting issues
- [x] 5.4 Run `pnpm build` to verify TypeScript compilation
