# Design: Add User Logout Feature

## Technical Approach

Implement a logout feature that clears user state from the Zustand store (including localStorage persistence) and redirects the user to the user selection screen. The logout function already exists in the interface but is not implemented.

## Architecture Decisions

### Decision: Zustand State Reset Strategy

**Choice**: Use `persist` middleware's `onRehydrateStorage` to clear storage, combined with setting state to initial values.

**Alternatives considered**:
- Manually calling `localStorage.removeItem('user')` - Would work but bypasses Zustand's API
- Creating a new store instance - Overkill for this use case

**Rationale**: Zustand's `set` with partial state update to reset `user` to `null` is idiomatic. The persist middleware will automatically update localStorage when state changes.

### Decision: Socket Handling on Logout

**Choice**: Disconnect socket on logout to ensure clean session termination.

**Alternatives considered**:
- Keep socket connected - User data cleared but socket remains active
- Reconnect on new login - Would require additional reconnection logic

**Rationale**: Disconnecting ensures no orphaned connections. The socket can be re-initialized when a new user logs in.

### Decision: Navigation After Logout

**Choice**: Use `useNavigate` hook from react-router-dom in the sidebar component.

**Alternatives considered**:
- Use `window.location.href` - Causes full page reload
- Handle redirect in store - Would require router dependency in store (not ideal)

**Rationale**: Sidebar already has access to routing context via React Router. Using `useNavigate` is the React-way and preserves SPA behavior.

## Data Flow

```
User clicks "Cerrar" button
         │
         ▼
Sidebar onClick handler
         │
         ▼
userState.logout() called
         │
    ┌────┴────┐
    ▼         ▼
Set user: null  ──►  persist middleware updates localStorage
    │                    │
    └────┬────┘          │
         ▼               │
    socket.disconnect()  │
         │               │
         └────┬────┘      │
              ▼          │
         navigate('/users')
              │
              ▼
    SelectUser screen rendered
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/store/user-state.ts` | Modify | Implement `logout` function in store |
| `src/components/sidebar.tsx` | Modify | Connect logout button to store, add navigation |

## Interfaces / Contracts

### UserState Store

```typescript
interface UserState {
  user: null | User;
  sendMessage: null | fn;
  setUser: (user: User) => void;
  setChats: (Chats: Chat[]) => void;
  chats: Chat[];
  handleSend: (user: Messages) => void;
  logout: () => void;  // Currently declared but not implemented
}
```

### Logout Implementation

```typescript
// In src/store/user-state.ts
logout: () => {
  set({ user: null, chats: [] });
  socket.disconnect();
}
```

### Sidebar Button

```typescript
// In src/components/sidebar.tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
const logout = userState((state) => state.logout);

const handleLogout = () => {
  logout();
  navigate('/users');
};

// Button JSX
<button onClick={handleLogout}>Cerrar</button>
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | logout function clears state correctly | Test Zustand store in isolation |
| Integration | Click button clears state and redirects | Component test with router |
| E2E | Full logout flow | Manual test or Cypress |

## Migration / Rollout

No migration required. This is a pure frontend feature addition with no data or API changes.

## Open Questions

- [ ] Should the socket be reconnected when a new user logs in, or should we create a new socket instance? (Current implementation creates socket at module load - may need refactor)
- [ ] Should we clear chats on logout? Currently the proposal mentions clearing user state, but chats may need to be cleared too.
