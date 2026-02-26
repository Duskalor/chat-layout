## Exploration: todo-list

### Current State
The project is a React 19 + Express chat application with JWT authentication, Socket.io for real-time messaging, and PostgreSQL (via Prisma). The frontend uses Zustand for state management, React Router v7, and Tailwind CSS v4.

### Affected Areas
- `frontend/src/store/user-state.ts` — Central state management; todo items could be added here
- `backend/prisma/schema.prisma` — Database models; new Todo model would need to be added
- `backend/src/services/` — New service for todo CRUD operations
- `backend/src/routes/` — New API routes for todo endpoints
- `frontend/src/components/` — New UI components for todo list display

### Approaches
1. **Standalone Todo List (per user)** — Users manage their own todo items
   - Pros: Simple, independent of chat
   - Cons: No collaboration features
   - Effort: Low

2. **Chat-integrated Todo List** — Todos associated with specific chats
   - Pros: Contextual to conversations, collaborative
   - Cons: More complex schema, requires chat context
   - Effort: Medium

3. **Global Todo List with User Association** — Todos linked to users, viewable in sidebar
   - Pros: Easy access, simple integration with existing user model
   - Cons: May feel disconnected from main chat flow
   - Effort: Low

### Recommendation
Approach #3 (Global Todo List with User Association) — Reuses existing user authentication and state patterns, minimal database changes, fits well in the existing sidebar layout.

### Risks
- Adding new API endpoints requires middleware for auth validation
- State management may need extension beyond current Zustand store
- Socket.io not needed for todos (can use REST API)

### Ready for Proposal
Yes. The architecture supports simple CRUD operations with the existing auth system. Proposal should specify:
- Database schema for Todo model
- API endpoints (GET, POST, PUT, DELETE /todos)
- Frontend component placement (sidebar or dedicated route)
