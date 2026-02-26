# Proposal: Connect Prisma Database to Backend

## Intent

The backend currently uses in-memory mock data for authentication and chat functionality, despite having Prisma fully configured with schema and migrations. This creates a disconnect between the configured database infrastructure and the actual data layer. We need to connect the backend to use the Prisma database instead of mock data to enable persistent data storage.

## Scope

### In Scope
- Add DATABASE_URL to .env.example
- Call connectDatabase() in backend/src/index.ts to establish Prisma connection
- Refactor auth.service.ts to use Prisma queries instead of mock data
- Refactor chat.service.ts to use Prisma queries instead of mock data
- Test that all CRUD operations work with the real database

### Out of Scope
- Database migrations or schema changes (already configured)
- Adding new database tables or relationships
- Switching to a different ORM or database technology

## Approach

1. Update `.env.example` to include `DATABASE_URL` with a placeholder connection string
2. Import and call `connectDatabase()` in `backend/src/index.ts` before starting the server
3. Replace mock data operations in `auth.service.ts` with Prisma client queries (findUser, createUser, etc.)
4. Replace mock data operations in `chat.service.ts` with Prisma client queries (findMessages, createMessage, etc.)
5. Run type-check and lint to verify changes

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/.env.example` | Modified | Add DATABASE_URL placeholder |
| `backend/src/index.ts` | Modified | Import and call connectDatabase() |
| `backend/src/services/auth.service.ts` | Modified | Replace mock data with Prisma queries |
| `backend/src/services/chat.service.ts` | Modified | Replace mock data with Prisma queries |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Database connection fails at runtime | Low | Add try/catch with clear error message; verify DATABASE_URL is set |
| Prisma queries return unexpected data format | Low | Test each service method after refactoring |
| TypeScript errors from Prisma types | Low | Run `pnpm build` to catch type errors before deploying |

## Rollback Plan

1. Revert changes to `backend/src/index.ts` to remove connectDatabase() call
2. Revert `backend/src/services/auth.service.ts` to restore mock data arrays
3. Revert `backend/src/services/chat.service.ts` to restore mock data arrays
4. Optionally revert `.env.example` to remove DATABASE_URL

## Dependencies

- PostgreSQL database running and accessible
- Prisma migration already applied (`20260224000404_init`)

## Success Criteria

- [ ] Backend connects to database on startup without errors
- [ ] User registration creates records in the database
- [ ] Login authenticates against database users
- [ ] Chat messages are stored and retrieved from database
- [ ] `pnpm build` completes without errors
- [ ] `pnpm lint` passes without errors
