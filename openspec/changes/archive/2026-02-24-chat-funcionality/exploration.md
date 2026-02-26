## Exploration: chat-funcionality

### Current State
The chat functionality currently works with **mock data only** - no database integration exists.

**Backend:**
- `chat.service.ts` (lines 1-103): Uses in-memory mock arrays (`mockMessages`, `mockUsers`, `mockChats`). All functions (`getUserChats`, `getChatById`, `getChatMessages`) return data from these arrays.
- `chat.controller.ts` (lines 1-27): Validates message payload with Valibot, emits to socket, but **never saves to database**.
- `index.ts` (lines 55-76): Socket.io handlers call mock service functions.

**Database (Prisma):**
- `schema.prisma` (lines 1-59): Complete schema with `User`, `Chat`, `Message`, `LastMessage` models - fully defined but **not connected**.

**Frontend:**
- `use-messages.tsx` (lines 1-82): Receives chats via socket `messages` event, updates new messages via `new_message` event, stores in Zustand.
- `socket-client.ts` (lines 1-27): Socket.io client with JWT auth.

### Affected Areas
- `backend/src/services/chat.service.ts` — Needs Prisma client integration
- `backend/src/controllers/chat.controller.ts` — Needs to call database
- `backend/src/index.ts` — Socket handlers need DB-backed service
- `backend/prisma/schema.prisma` — Already complete, needs to be used

### What's Working
- Socket.io connection/authentication
- Real-time message broadcasting (in-memory only)
- Mock data served to frontend
- Frontend receives and displays messages

### What's Missing (Database Integration)
1. **Prisma client not imported** in any chat service/controller
2. **No message persistence** - messages sent via socket are emitted but not saved
3. **No chat fetching from DB** - returns mock data only
4. **No user-chat relationships** queried from database
5. **No REST endpoints** for chat CRUD (only socket events)

### Approaches

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| 1. Full Prisma Integration | Complete data persistence, scalable | More changes needed | High |
| 2. Hybrid (Keep mocks + DB saves) | Fast migration, incremental | Dual data sources, potential sync issues | Medium |

### Recommendation
**Approach 1: Full Prisma Integration** - Replace mock arrays with Prisma queries in `chat.service.ts`. Update socket handlers in `index.ts` to save messages to DB before emitting. This is the correct long-term solution.

### Risks
- Data migration from mock to DB needs careful handling
- Socket events need to wait for DB writes (potential latency)
- Schema field mismatches between backend types and Prisma models (e.g., `chatId` vs `chatID`)

### Ready for Proposal
Yes. The proposal should cover:
1. Replace mock service with Prisma queries
2. Save messages to DB in socket handler before emit
3. Add REST endpoints for chat CRUD (optional)
4. Align frontend/backend type field names (chatId → chatID)
