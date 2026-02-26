# Tasks: Chat Functionality Database Integration

## Phase 1: Infrastructure

- [x] 1.1 Create `backend/src/config/prisma.ts` with PrismaClient singleton export and `connectDatabase()` helper function
- [x] 1.2 Update `backend/src/config/index.ts` to add `databaseUrl` to AppConfig interface
- [x] 1.3 Add database connection verification in `backend/src/index.ts` before server starts (wrap in try/catch, log but continue)

## Phase 2: Core Implementation

- [x] 2.1 Update `backend/src/middleware/validate.ts` to make `id` optional in messageSchema (DB auto-generates)
- [x] 2.2 Create mapping helpers in `backend/src/services/chat.service.ts` for converting Prisma types to app types (`mapChatFromPrisma`, `mapMessageFromPrisma`)
- [x] 2.3 Refactor `getUserChats` in `backend/src/services/chat.service.ts` to use `prisma.chat.findMany` with participants filter and include
- [x] 2.4 Refactor `getChatById` in `backend/src/services/chat.service.ts` to use `prisma.chat.findUnique` with include
- [x] 2.5 Refactor `getChatMessages` in `backend/src/services/chat.service.ts` to use `prisma.message.findMany` with orderBy
- [x] 2.6 Add `createMessage` function in `backend/src/services/chat.service.ts` using `prisma.message.create` and `prisma.lastMessage.upsert`
- [x] 2.7 Add field normalization in `backend/src/controllers/chat.controller.ts` (`chatID` → `chatId`, `userID` → `senderId`, `createAt` → `createdAt`)
- [x] 2.8 Update `sendMessage` in `backend/src/controllers/chat.controller.ts` to save to database before emitting via socket

## Phase 3: Testing & Verification

- [x] 3.1 Run `npx prisma db push` to sync schema with database
- [x] 3.2 Start backend server and verify database connection log message appears
- [x] 3.3 Test sending a message via socket and verify it persists to database
- [x] 3.4 Test fetching chats and verify data comes from database instead of mock
- [x] 3.5 Run `pnpm build` to verify TypeScript compilation
- [x] 3.6 Run `pnpm lint` to verify no lint errors
