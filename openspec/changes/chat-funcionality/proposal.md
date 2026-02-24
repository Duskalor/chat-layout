# Proposal: Chat Functionality Database Integration

## Intent

The chat functionality currently relies on in-memory mock data, meaning messages are broadcast in real-time but never persisted to the database. This prevents users from retrieving chat history, breaks data consistency, and prevents the application from scaling beyond a single server instance. This change integrates the existing Prisma schema with the chat service to persist all messages and chats to the database.

## Scope

### In Scope
- Import and initialize Prisma Client in the backend
- Replace mock arrays in `chat.service.ts` with Prisma queries
- Save messages to database before socket emit in `chat.controller.ts`
- Fetch chats and messages from database instead of mock data
- Fix field naming mismatches (e.g., `chatId` vs `chatID`)
- Update socket handlers in `index.ts` to use database-backed service

### Out of Scope
- Adding REST endpoints for chat CRUD (keep socket-only for now)
- Implementing chat creation from frontend
- User authentication changes (already working)
- Frontend UI changes

## Approach

Implement **Full Prisma Integration** as recommended by the exploration:

1. **Initialize Prisma Client**: Add Prisma client import and singleton pattern in a new or existing DB utility file
2. **Update Chat Service**: Replace `mockMessages`, `mockChats`, `mockUsers` arrays with Prisma queries (`prisma.message.findMany`, `prisma.chat.findMany`, etc.)
3. **Update Controller**: Modify `sendMessage` to save to database before emitting to socket
4. **Fix Field Names**: Ensure consistent naming between TypeScript types and Prisma schema (check `chatId` → `chatID`)
5. **Update Socket Handlers**: Ensure `index.ts` calls service methods that now query the database

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/services/chat.service.ts` | Modified | Replace mock arrays with Prisma queries |
| `backend/src/controllers/chat.controller.ts` | Modified | Save messages to DB before socket emit |
| `backend/src/index.ts` | Modified | Socket handlers use database-backed service |
| `backend/prisma/schema.prisma` | Already Complete | Schema ready to be connected |
| `backend/src/config/index.ts` | New/Modified | Prisma client initialization if needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Database connection failure | Low | Add try/catch with proper error handling; log connection errors |
| Socket latency from DB writes | Medium | Ensure DB writes are fast; consider async with acknowledgment |
| Field naming mismatch errors | Medium | Validate all field names match Prisma schema exactly |
| Data migration issues | Low | Keep mock data as fallback during initial deployment |

## Rollback Plan

1. Revert changes to `chat.service.ts` to use mock arrays again
2. Revert `chat.controller.ts` to emit without DB save
3. Keep Prisma client initialized but unused
4. Frontend requires no changes - socket events remain the same
5. Deploy previous version if database integration causes critical failures

## Dependencies

- Prisma schema must be valid (`npx prisma validate`)
- Database must be accessible (check `DATABASE_URL` in `.env`)
- Socket.io authentication must continue working

## Success Criteria

- [ ] Messages sent via chat are persisted to database
- [ ] Chat list fetches from database instead of mock data
- [ ] Chat history (previous messages) loads from database
- [ ] No runtime errors related to Prisma client or queries
- [ ] Socket events still broadcast messages in real-time
- [ ] Field names match between frontend types and backend/Prisma
