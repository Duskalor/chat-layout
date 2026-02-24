# Design: Implement Real Login System

## Technical Approach

Replace the current user selection flow at `/users` with a proper email/password authentication system. The implementation will use JWT tokens stored in httpOnly cookies for secure session management. The frontend will validate credentials against a backend API, store the authentication state in the existing Zustand store, and protect routes using a layout-level auth guard.

## Architecture Decisions

### Decision: Token Storage Strategy

**Choice**: httpOnly cookies for JWT storage
**Alternatives considered**: LocalStorage/SessionStorage (vulnerable to XSS), in-memory only (lost on refresh)
**Rationale**: httpOnly cookies cannot be accessed by JavaScript, providing protection against XSS attacks. The browser automatically handles cookie sending with requests.

### Decision: Route Protection Approach

**Choice**: Protected layout wrapper with redirect
**Alternatives considered**: Individual route guards, Higher-Order Component (HOC) pattern
**Rationale**: Using a layout wrapper keeps the routing configuration clean and centralizes auth logic. React Router v7's nested routes work well with this pattern.

### Decision: Auth State Management

**Choice**: Extend existing Zustand store with auth-specific fields
**Alternatives considered**: Separate auth store, React Context
**Rationale**: The project already uses Zustand for user state. Extending the existing store maintains consistency and simplifies the codebase.

## Data Flow

```
┌────────────────┐     ┌─────────────────┐     ┌────────────────┐
│  LoginForm     │────▶│  Auth API       │────▶│  Backend       │
│  Component    │     │  (fetch/axios)  │     │  /auth/login   │
└────────────────┘     └─────────────────┘     └────────────────┘
        │                       │
        │◀──────────────────────┘
        │              (JWT in httpOnly cookie)
        ▼
┌────────────────┐     ┌─────────────────┐     ┌────────────────┐
│  Zustand Store │◀───▶│  Protected      │────▶│  App Content   │
│  (userState)   │     │  Routes         │     │  (Chat, etc.)  │
└────────────────┘     └─────────────────┘     └────────────────┘
        │
        ▼
┌────────────────┐
│  Socket Client │
│  (with token)  │
└────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/login-form.tsx` | Create | Login form with email/password fields, validation, error handling |
| `src/components/protected-route.tsx` | Create | Wrapper component that checks auth state and redirects to login |
| `src/store/user-state.ts` | Modify | Add: `isAuthenticated`, `token`, `login(credentials)`, `clearAuth()` actions |
| `src/route/routes.tsx` | Modify | Add `/login` route, wrap protected routes with auth guard |
| `src/lib/socket-client.ts` | Modify | Include auth token in socket connection options |
| `src/lib/auth-api.ts` | Create | API functions for login/logout HTTP calls |
| `src/assets/types/auth.type.ts` | Create | Type definitions for auth responses and credentials |

## Interfaces / Contracts

### Auth Types (`src/assets/types/auth.type.ts`)

```typescript
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: Omit<User, 'password'>;
  message?: string;
}
```

### Updated UserState Store

```typescript
interface UserState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  // ... existing fields
}
```

### Protected Route Component

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Login form validation, store actions | Vitest with @testing-library/react |
| Unit | ProtectedRoute redirect logic | Vitest with MemoryRouter |
| Integration | Auth flow end-to-end | Playwright |
| Integration | Socket reconnection with auth | Manual testing with backend |

## Migration / Rollout

No migration required. This is a net-new feature replacing the existing `/users` user selection flow:

1. Deploy backend auth endpoint first (prerequisite)
2. Deploy frontend with login feature
3. Users accessing `/users` will see login form instead
4. Existing persisted user state will be cleared on first load

## Open Questions

- [ ] Does the backend have the `/auth/login` endpoint implemented? If not, should we mock it for frontend development?
- [ ] Should we implement a "remember me" feature for longer session persistence?
- [ ] Do we need to handle token refresh, or will the backend handle session expiry differently?
