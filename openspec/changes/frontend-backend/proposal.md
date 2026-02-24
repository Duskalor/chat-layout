# Proposal: Frontend-Backend Integration

## Intent

Connect the React 19 frontend to the existing Express + Socket.io backend to replace mock authentication with real API calls and enable real-time messaging. Currently, the frontend uses hardcoded mock data in `src/lib/auth-api.ts` while the backend at `backend/` already implements `/auth/login`, `/auth/logout`, and Socket.io events.

## Scope

### In Scope
- Replace mock auth in `src/lib/auth-api.ts` with real HTTP calls to backend
- Update `src/lib/socket-client.ts` to connect to actual backend Socket.io server
- Update `src/store/user-state.ts` to handle real auth responses
- Update login-form.tsx to handle real API errors
- Ensure all auth spec scenarios work with real backend

### Out of Scope
- Adding database (keep in-memory store)
- User registration endpoint
- Real-time typing indicators
- Message read receipts
- Message media/attachments

## Approach

1. **Verify Backend** - Backend already exists at `backend/src/index.ts` with:
   - Express server on port 3000
   - Socket.io for real-time events
   - In-memory user store (6 test users)
   - JWT token generation

2. **API Endpoints (Already Implemented)**
   | Method | Endpoint | Description |
   |--------|----------|-------------|
   | POST | /auth/login | Authenticate user, return JWT + chats |
   | POST | /auth/logout | Invalidate session |

3. **Socket Events (Already Implemented)**
   | Event | Direction | Description |
   |-------|-----------|-------------|
   | `connected` | Client→Server | User connects with userId |
   | `messages` | Server→Client | Send chat list on connect |
   | `sendMessage` | Client→Server | Send new message |
   | `new_message` | Server→Client | Broadcast received message |

4. **Frontend Integration**
   - Update `src/lib/config.ts` to point to `http://localhost:3000`
   - Replace mock auth in `src/lib/auth-api.ts` with real fetch calls
   - Update `src/lib/socket-client.ts` to connect to real server
   - Update `src/store/user-state.ts` to handle real responses

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/index.ts` | Existing | Already implements required endpoints |
| `frontend/src/lib/auth-api.ts` | Modified | Replace mock auth with fetch calls |
| `frontend/src/lib/socket-client.ts` | Modified | Connect to real Socket.io server |
| `frontend/src/lib/config.ts` | Verify | Ensure backend URL is correct |
| `frontend/src/store/user-state.ts` | Modified | Handle real API responses |
| `frontend/src/components/login-form.tsx` | Modified | Handle real error states |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CORS issues between frontend/backend | Medium | Backend already has CORS configured for `*` |
| Token storage security | Low | Use httpOnly cookies in future; token in memory for now |
| Socket reconnection on network issues | Medium | Add reconnection logic to socket-client.ts |

## Rollback Plan

1. Revert `src/lib/auth-api.ts` to mock implementation
2. Revert `src/lib/socket-client.ts` to not connect
3. Revert `src/store/user-state.ts` to mock login/logout
4. Revert login-form.tsx to mock error handling
5. Frontend will work with mock data again

## Dependencies

- Backend server must be running on `http://localhost:3000`
- No external APIs required

## Success Criteria

- [ ] User can log in with valid credentials (`test@test.com` / `password123`)
- [ ] Invalid credentials show error message
- [ ] Socket connects after login and receives chat list
- [ ] User can send messages that appear in real-time
- [ ] User can log out and select different user
- [ ] Application type-checks with `pnpm build`
- [ ] Application passes linting with `pnpm lint`
