# Design: Frontend-Backend Integration

## Technical Approach

Connect the React 19 frontend to the existing Express + Socket.io backend to replace mock authentication with real API calls and enable real-time messaging. The backend already implements all required endpoints and socket events. The integration involves updating the frontend to consume these real endpoints instead of mock data.

## Architecture Decisions

### Decision: Keep In-Memory Data Store

**Choice**: Use in-memory JavaScript arrays for users and messages
**Alternatives considered**: SQLite, PostgreSQL, MongoDB
**Rationale**: Proposal explicitly states "keep in-memory store" to avoid added complexity. Suitable for development/demo purposes. Easy to swap for database later.

### Decision: Simple JWT Token Format

**Choice**: Return mock JWT token (`jwt-token-{timestamp}`) instead of real JWT
**Alternatives considered**: Use jsonwebtoken library with secret key
**Rationale**: Current implementation is sufficient for demo. Real JWT would require additional setup but is not needed for current scope.

### Decision: Broadcast All Messages via Socket.io

**Choice**: Broadcast new messages to all connected clients
**Alternatives considered**: Target specific users/chats using socket rooms
**Rationale**: Simpler implementation per proposal scope. Production would use rooms for privacy.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ login-form   │───▶│ user-state   │───▶│ socket-client│      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │              │
│         ▼                   ▼                   ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ auth-api.ts  │    │ config.ts    │    │ socket.io    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└───────────────────────────┬────────────────────────────────────┘
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Express      │    │ Socket.io    │    │ In-Memory    │      │
│  │ /auth/login  │    │ Events       │    │ Store        │      │
│  │ /auth/logout │    │              │    │              │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Login Flow

```
User submits credentials
        │
        ▼
login-form.tsx calls userState.login()
        │
        ▼
user-state.ts calls loginApi(credentials)
        │
        ▼
auth-api.ts makes POST /auth/login
        │
        ▼
Backend validates credentials against in-memory users
        │
        ▼
Backend returns { success, user, token, chats }
        │
        ▼
user-state.ts updates Zustand store with response
        │
        ▼
socket-client.ts connects with token
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/index.ts` | Existing | Express + Socket.io server on port 3000 |
| `frontend/src/lib/config.ts` | Verify | Already points to `http://localhost:3000` |
| `frontend/src/lib/auth-api.ts` | Modify | Replace mock data with fetch calls to backend |
| `frontend/src/lib/socket-client.ts` | No Change | Already connects to config.URL |
| `frontend/src/store/user-state.ts` | Minor | Already handles API responses correctly |

## Interfaces / Contracts

### Backend REST API

```typescript
// POST /auth/login
Request:
{
  email: string;
  password: string;
}

Response (success):
{
  success: true;
  user: {
    id: string;
    name: string;
    email: string;
    createAt: Date;
    updateAt: Date;
  };
  token: string;
  chats: Chat[];
}

Response (error):
{
  success: false;
  message: string;
}

// POST /auth/logout
Request: (empty body)

Response:
{
  success: true;
}
```

### Socket.io Events

```typescript
// Client → Server
socket.emit('connected', userId: string);
socket.emit('sendMessage', message: Message);

// Server → Client
socket.on('messages', chats: Chat[]);
socket.on('new_message', message: Message);
```

### Data Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createAt: Date;
  updateAt: Date;
}

interface Message {
  id: string;
  chatID: string;
  senderId: string;
  text: string;
  createAt: string;
}

interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: User[];
  messages: Message[];
  createAt: Date;
  updateAt: Date;
  lastMessage?: {
    createdAt: string;
    senderId: string;
    text: string;
  };
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | auth-api.ts fetch functions | Test successful and error responses |
| Integration | Frontend ↔ Backend | Manual testing with dev servers |
| E2E | Full login → chat flow | Not configured per project |

## Migration / Rollback

No migration required. This is a development-time integration change.

**Rollback steps if needed:**
1. Revert `auth-api.ts` to mock implementation
2. Frontend returns to working with mock data

## Open Questions

- [ ] Should we add proper JWT validation with jsonwebtoken library?
- [ ] Should socket messages be targeted to specific chat rooms instead of broadcast?
- [ ] Do we need to persist messages beyond server restart?

