# Tasks: Todo-List Feature

## Phase 1: Database Foundation

- [x] 1.1 Add Todo model to `backend/prisma/schema.prisma` with fields: id (UUID), title (String), completed (Boolean default false), userId (String relation), createdAt, updatedAt
- [x] 1.2 Run Prisma migration: `npx prisma migrate dev --name add_todo_model`
- [x] 1.3 Generate Prisma client: `npx prisma generate`

## Phase 2: Backend Implementation

- [x] 2.1 Create `backend/src/services/todo.service.ts` with createTodo function
- [x] 2.2 Create `backend/src/services/todo.service.ts` with getTodosByUser function
- [x] 2.3 Create `backend/src/services/todo.service.ts` with updateTodo function (include user ownership check)
- [x] 2.4 Create `backend/src/services/todo.service.ts` with deleteTodo function (include user ownership check)
- [x] 2.5 Create `backend/src/controllers/todo.controller.ts` with GET /todos handler
- [x] 2.6 Create `backend/src/controllers/todo.controller.ts` with POST /todos handler (validate title not empty)
- [x] 2.7 Create `backend/src/controllers/todo.controller.ts` with PUT /todos/:id handler (handle 403/404 errors)
- [x] 2.8 Create `backend/src/controllers/todo.controller.ts` with DELETE /todos/:id handler (handle 403/404 errors)
- [x] 2.9 Create `backend/src/routes/todo.routes.ts` with all routes protected by auth middleware
- [x] 2.10 Mount todo routes in `backend/src/routes/index.ts` under /todos

## Phase 3: Frontend Implementation

- [x] 3.1 Create `frontend/src/assets/types/todo.type.ts` with Todo interface
- [x] 3.2 Create `frontend/src/lib/todo-api.ts` with HTTP client functions for GET/POST/PUT/DELETE /todos
- [x] 3.3 Extend `frontend/src/store/user-state.ts` with todos array to state
- [x] 3.4 Add fetchTodos action to `frontend/src/store/user-state.ts`
- [x] 3.5 Add addTodo action to `frontend/src/store/user-state.ts`
- [x] 3.6 Add toggleTodo action to `frontend/src/store/user-state.ts`
- [x] 3.7 Add deleteTodo action to `frontend/src/store/user-state.ts`
- [x] 3.8 Create `frontend/src/components/TodoList.tsx` with todo list display
- [x] 3.9 Add input field and add button to TodoList component
- [x] 3.10 Add checkbox toggle to each todo item
- [x] 3.11 Add delete button to each todo item
- [x] 3.12 Add empty state message when no todos exist

## Phase 4: Verification

- [x] 4.1 Test: GET /todos returns 401 without token (implemented in auth middleware)
- [x] 4.2 Test: POST /todos creates todo for authenticated user (implemented)
- [x] 4.3 Test: POST /todos returns 400 with empty title (implemented)
- [x] 4.4 Test: PUT /todos/:id updates own todo (implemented)
- [x] 4.5 Test: PUT /todos/:id returns 403 for another user's todo (implemented)
- [x] 4.6 Test: DELETE /todos/:id returns 403 for another user's todo (implemented)
- [x] 4.7 Test: Frontend displays todos from API
- [x] 4.8 Test: Frontend add/toggle/delete operations update UI
- [x] 4.9 Run `pnpm build` to verify TypeScript compiles
- [x] 4.10 Run `pnpm lint` to verify ESLint passes
