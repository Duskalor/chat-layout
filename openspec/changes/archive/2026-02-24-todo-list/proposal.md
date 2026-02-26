# Proposal: Add Todo-List Feature

## Intent

Enable users to create, manage, and track personal todo items within the chat application. This addresses the need for users to maintain task lists without leaving the application, leveraging the existing user authentication and state management infrastructure.

## Scope

### In Scope
- Database model for Todo items (user-owned, personal task list)
- REST API endpoints for CRUD operations (GET, POST, PUT, DELETE /todos)
- Frontend UI component for displaying and managing todos
- Integration with existing Zustand store for state management
- Integration with existing JWT authentication system

### Out of Scope
- Collaborative todos (shared between users)
- Todo notifications or reminders
- Todo categories or tags
- Chat-integrated todos (todos within specific conversations)
- Real-time sync via Socket.io (REST API only)

## Approach

Implement a **Global Todo List with User Association** approach:
- Todos are linked to authenticated users via userId
- Accessible from a sidebar panel or dedicated view
- Uses existing JWT auth middleware for protection
- Follows existing backend service/route patterns
- Zustand store extended with todo slice

### Technical Implementation
1. Add Todo model to Prisma schema with fields: id, title, completed, userId, createdAt, updatedAt
2. Create todo service with CRUD operations
3. Add todo routes with auth middleware
4. Extend Zustand store with todo state and actions
5. Create TodoList React component with add/toggle/delete functionality

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modified | Add Todo model with user relation |
| `backend/src/services/todo.service.ts` | New | CRUD operations for todos |
| `backend/src/routes/todo.routes.ts` | New | API endpoints for todo management |
| `backend/src/routes/index.ts` | Modified | Mount todo routes |
| `frontend/src/store/user-state.ts` | Modified | Add todo state and actions |
| `frontend/src/components/TodoList.tsx` | New | UI component for todo display |
| `frontend/src/route/routes.tsx` | Modified | Add todo route if needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| State management complexity increase | Medium | Keep todo state separate, follow existing patterns |
| Auth middleware reuse issues | Low | Reuse existing auth middleware, test protected endpoints |
| Database migration conflicts | Low | Add nullable fields first, then populate |

## Rollback Plan

1. Revert Prisma schema and run migration rollback
2. Delete todo service and route files
3. Remove todo state from Zustand store
4. Remove TodoList component
5. No data migration needed - todos are user-scoped

## Dependencies

- Existing JWT authentication system (backend/src/middleware/auth.ts)
- Existing Prisma setup with PostgreSQL
- Existing Zustand store pattern
- React 19 + TypeScript frontend

## Success Criteria

- [ ] Users can create new todo items with a title
- [ ] Users can view their todo list
- [ ] Users can mark todos as completed/uncompleted
- [ ] Users can delete todo items
- [ ] All todo API endpoints are protected by JWT auth
- [ ] Todo state persists in database
- [ ] TypeScript builds without errors
- [ ] ESLint passes without errors
