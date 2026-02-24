# Tasks: Implement Real Login System

## Phase 1: Foundation / Infrastructure

- [x] 1.1 Create `src/assets/types/auth.type.ts` with `LoginCredentials` and `AuthResponse` interfaces
- [x] 1.2 Create `src/lib/auth-api.ts` with `login(credentials: LoginCredentials): Promise<AuthResponse>` function using fetch to POST `/auth/login`
- [x] 1.3 Create `src/lib/auth-api.ts` with `logout(): Promise<void>` function to clear session

## Phase 2: Core Implementation

- [x] 2.1 Update `src/store/user-state.ts`: Add `isAuthenticated: boolean`, `token: string | null`, and `login` action
- [x] 2.2 Update `src/store/user-state.ts`: Modify `logout` to clear auth state and disconnect socket
- [x] 2.3 Update `src/store/user-state.ts`: Add token validation on store initialization (check stored token)
- [x] 2.4 Create `src/components/login-form.tsx` with email/password fields, validation (required fields), submit handler calling login API
- [x] 2.5 Create `src/components/login-form.tsx`: Add error display for invalid credentials and network errors
- [x] 2.6 Create `src/components/protected-route.tsx` with redirect to `/login` when not authenticated

## Phase 3: Integration / Wiring

- [x] 3.1 Update `src/route/routes.tsx`: Add `/login` route pointing to login form component
- [x] 3.2 Update `src/route/routes.tsx`: Wrap chat routes with protected route component, redirect to `/login`
- [x] 3.3 Update `src/route/routes.tsx`: Remove or redirect `/users` to `/login` (old user selection flow)
- [x] 3.4 Update `src/lib/socket-client.ts`: Include auth token in socket connection options (auth: { token })

## Phase 4: Testing & Verification

- [x] 4.1 Run type-check: `pnpm build` (or `tsc -b`)
- [x] 4.2 Run linting: `pnpm lint`
- [ ] 4.3 Verify login form displays when accessing protected route without auth
- [ ] 4.4 Verify successful login redirects to chat interface
- [ ] 4.5 Verify logout clears session and redirects to login
