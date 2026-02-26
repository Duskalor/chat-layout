# Tasks: Connect Prisma Database to Backend

## Phase 1: Infrastructure

- [x] 1.1 Add DATABASE_URL to `backend/.env.example` with format `postgresql://user:password@localhost:5432/chat`
- [x] 1.2 Import `connectDatabase` in `backend/src/index.ts` from `./config/prisma.js`
- [x] 1.3 Call `connectDatabase()` in `backend/src/index.ts` before `httpServer.listen()` with try/catch error handling

## Phase 2: Implementation

- [x] 2.1 Refactor `backend/src/services/user.service.ts` - import prisma client, replace `findUserByEmail` mock with `prisma.user.findUnique`
- [x] 2.2 Refactor `backend/src/services/user.service.ts` - replace `getUserById` mock with `prisma.user.findUnique`
- [x] 2.3 Refactor `backend/src/services/auth.service.ts` - make `login` function async and await `findUserByEmail`
- [x] 2.4 Refactor `backend/src/services/chat.service.ts` - import prisma client, replace `getUserChats` mock with `prisma.chat.findMany`
- [x] 2.5 Refactor `backend/src/services/chat.service.ts` - replace `getChatById` mock with `prisma.chat.findUnique`
- [x] 2.6 Refactor `backend/src/services/chat.service.ts` - replace `getChatMessages` with `prisma.message.findMany`

## Phase 3: Testing

- [x] 3.1 Start the backend server and verify database connection message appears
- [ ] 3.2 Test login endpoint with a database user to verify auth works
- [ ] 3.3 Test chat retrieval to verify messages load from database
- [x] 3.4 Run `pnpm build` to verify TypeScript compiles without errors
- [x] 3.5 Run `pnpm lint` to verify no linting issues (not available in backend package.json)
