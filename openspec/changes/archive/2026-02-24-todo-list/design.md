# Design: Todo-List Feature

## Technical Approach

Implement a **Global Todo List with User Association** as a new feature module. The implementation follows the existing backend service/route patterns using Express + Prisma, and extends the existing Zustand store for state management. All todo endpoints are protected by the existing JWT auth middleware. No Socket.io integration needed—REST API only.

## Architecture Decisions

### Decision: Prisma Schema Structure

**Choice**: Add Todo model with one-to-many relation to User (one User has many Todos)

**Alternatives considered**: 
- Standalone Todo model without user relation (rejected—todos must be user-scoped for security)
- Chat-linked todos (rejected—out of scope per proposal)

**Rationale**: Follows existing patterns (Chat→User, Message→User relations) and provides straightforward cascade delete when user is deleted.

---

### Decision: API Response Pattern

**Choice**: Return todo objects directly in JSON responses, with error responses following existing { message: string } format

**Alternatives considered**: Wrapped response { success: boolean, data: Todo[], error?: string } (rejected—inconsistent with existing API style)

**Rationale**: Maintains consistency with existing auth and chat endpoints which return raw objects or { message: string } for errors.

---

### Decision: State Management Strategy

**Choice**: Extend existing Zustand `user-state.ts` store with todo slice (todos array + CRUD actions)

**Alternatives considered**: 
- Create separate Zustand store for todos (rejected—adds unnecessary complexity)
- Store todos only in component state (rejected—no persistence across navigation)

**Rationale**: Follows existing store pattern with persist middleware; todos auto-sync with localStorage like user data.

---

### Decision: Frontend Component Structure

**Choice**: Create standalone `TodoList.tsx` component with internal UI state for form inputs

**Alternatives considered**: 
- Embed todo UI in existing sidebar (rejected—more complex, harder to maintain)
- Separate TodoPage component with route (rejected—simpler as panel/drawer)

**Rationale**: Simple, reusable component that can be placed in sidebar or as standalone view; follows existing component patterns (Input.tsx, chat.tsx).

## Data Flow

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  TodoList.tsx   │────▶│  Zustand     │────▶│  auth-api.ts    │
│  (UI Component) │     │  Store       │     │  (HTTP Client)  │
└─────────────────┘     └──────────────┘     └────────┬────────┘
         │                                               │
         │                                               ▼
         │                                      ┌────────────────┐
         │                                      │  /todos API    │
         │                                      │  (Express)     │
         └─────────────────────────────────────▶│  (Protected)  │
                                                └───────┬────────┐
                                                        │
                                                        ▼
                                               ┌────────────────┐
                                               │  todo.service  │
                                               │  (Prisma)      │
                                               └───────┬────────┘
                                                       │
                                                       ▼
                                               ┌────────────────┐
                                               │  PostgreSQL    │
                                               │  (Todo table)  │
                                               └────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/schema.prisma` | Modify | Add Todo model with user relation |
| `backend/src/services/todo.service.ts` | Create | CRUD operations: createTodo, getTodos, updateTodo, deleteTodo |
| `backend/src/controllers/todo.controller.ts` | Create | Request handlers for todo endpoints |
| `backend/src/routes/todo.routes.ts` | Create | API routes: GET/POST/PUT/DELETE /todos |
| `backend/src/routes/index.ts` | Modify | Mount todo routes under /todos |
| `frontend/src/assets/types/todo.type.ts` | Create | TypeScript interface for Todo |
| `frontend/src/lib/todo-api.ts` | Create | HTTP client for todo endpoints |
| `frontend/src/store/user-state.ts` | Modify | Add todos array and CRUD actions |
| `frontend/src/components/TodoList.tsx` | Create | React component for todo UI |

## Interfaces / Contracts

### Backend - Todo Model (Prisma)

```typescript
model Todo {
  id        String   @id @default(uuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Backend - Todo Service

```typescript
// backend/src/services/todo.service.ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const createTodo = (userId: string, title: string): Promise<Todo>
export const getTodosByUser = (userId: string): Promise<Todo[]>
export const updateTodo = (todoId: string, userId: string, data: { title?: string; completed?: boolean }): Promise<Todo>
export const deleteTodo = (todoId: string, userId: string): Promise<void>
```

### Backend - API Endpoints

```
GET    /todos           - Get all todos for authenticated user
POST   /todos           - Create new todo { title: string }
PUT    /todos/:id       - Update todo { title?: string, completed?: boolean }
DELETE /todos/:id       - Delete todo
```

### Frontend - Todo Type

```typescript
// frontend/src/assets/types/todo.type.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

### Frontend - Store Extension

```typescript
// Additions to user-state.ts
interface UserState {
  // ... existing fields
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  fetchTodos: () => Promise<void>;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | todo.service.ts functions | Test Prisma mock calls, error handling |
| Unit | Zustand store actions | Test state mutations with zustand mock store |
| Integration | API endpoints | Test with supertest + auth middleware |
| Integration | TodoList component | Test user interactions with React Testing Library |

**Note**: No E2E tests planned—use manual verification per success criteria.

## Migration / Rollout

1. Run Prisma migration: `npx prisma migrate dev --name add_todo_model`
2. Deploy backend first (new endpoints protected by existing auth)
3. Deploy frontend with new component
4. No data migration needed—todos are user-scoped, new table is empty

## Open Questions

- [ ] Should todos be displayed in sidebar panel or as separate route? (Component design decision)
- [ ] Any specific sorting order needed for todo list? (default: createdAt desc)
