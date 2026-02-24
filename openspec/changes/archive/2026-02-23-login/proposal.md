# Proposal: Implement Real Login System

## Intent

The current "login" system at `/users` is not authentication—it allows any user to impersonate any other user by simply clicking on a user card. This is a security vulnerability and does not meet the requirements of a real authentication system. We need to implement proper email/password authentication with credential validation and session management.

## Scope

### In Scope
- Login form with email and password fields
- Backend API endpoint for credential validation
- JWT or session token issuance on successful login
- Token storage and management (httpOnly cookie or secure storage)
- Protected routes that require authentication
- Logout functionality that clears session
- Error handling for invalid credentials

### Out of Scope
- Password reset functionality
- Registration/signup flow
- OAuth/SSO integration
- Two-factor authentication
- Email verification

## Approach

Implement a traditional email/password login flow:

1. Replace the user selection page (`/users`) with a login form
2. Create backend authentication endpoint (`POST /auth/login`) that validates email/password
3. On successful validation, issue a JWT token or create a session
4. Store token securely (httpOnly cookie preferred)
5. Add authentication middleware to protect routes
6. Update Zustand store to handle auth state with tokens
7. Implement logout that clears session and redirects to login

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/select-user.tsx` | Modified | Replace user selection with login form |
| `src/store/user-state.ts` | Modified | Add auth state, token handling, login/logout actions |
| `src/route/routes.tsx` | Modified | Add protected routes, auth guard |
| `src/lib/socket-client.ts` | Modified | Include auth token in socket connection |
| `src/assets/types/users.type.ts` | Reviewed | Password field already exists but unused |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend doesn't have auth endpoint | High | Create backend auth API first, or mock for frontend dev |
| Token storage XSS vulnerabilities | Medium | Use httpOnly cookies, implement CSRF protection |
| Breaking existing user selection flow | Low | Ensure graceful fallback, clear error messages |

## Rollback Plan

1. Revert `select-user.tsx` to show user cards again
2. Remove auth token logic from `user-state.ts`
3. Remove route protection from `routes.tsx`
4. Remove token from socket client initialization
5. User returns to clicking user cards to "login"

## Dependencies

- Backend authentication endpoint (`POST /auth/login`)
- Backend user verification with password hashing
- Token generation/validation on backend

## Success Criteria

- [ ] Users can log in with email and password
- [ ] Invalid credentials show appropriate error message
- [ ] Authenticated user session persists across page refreshes
- [ ] Logout clears session and redirects to login
- [ ] Unauthenticated access to protected routes redirects to login
- [ ] Socket connection includes auth token
- [ ] TypeScript build passes with no errors
- [ ] ESLint passes with no errors
