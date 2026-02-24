# Proposal: Add User Logout Feature

## Why

The application currently lacks a way for users to sign out. When a user selects a profile, they remain logged in until they manually clear localStorage or the browser cache.

**Context**:
- Users select a profile from a list to "log in"
- User state is persisted in localStorage via Zustand persist middleware
- There's a placeholder logout button in the sidebar (`<button>Cerrar</button>`) that has no functionality

**Current state**:
- User can select a profile and become that user
- Selected user persists across browser sessions
- No logout mechanism exists

**Desired state**:
- Users can click a logout button to clear their session
- User is redirected to the user selection screen
- All user state is cleared from localStorage

## What Changes

- Add `logout` function to Zustand store (`src/store/user-state.ts`)
- Connect sidebar logout button to call the logout function
- Redirect user to `/users` route after logout
- Optionally disconnect socket on logout

## Impact

### Affected Code
- `src/store/user-state.ts` - Add logout function
- `src/components/sidebar.tsx` - Connect logout button to store
- `src/route/routes.tsx` - May need redirect logic

### User Impact
- Users gain the ability to sign out
- Clear session state between users

### Migration Required
- [ ] No database migration needed
- [x] No API changes needed
- [ ] No user communication needed
- [ ] Documentation updates (optional)

## Timeline Estimate

Small - approximately 1-2 hours

## Risks

- Minimal risk - simple state management change
- Ensure socket connection is properly handled on logout
