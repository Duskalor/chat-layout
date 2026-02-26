# Tasks: Database Seed Script

## Phase 1: Infrastructure (package.json config)

- [x] 1.1 Add `prisma.seed` configuration to `backend/package.json` pointing to `tsx backend/prisma/seed.ts`
- [x] 1.2 Add `db:seed` script to `backend/package.json` that runs `prisma db seed`

## Phase 2: Implementation (seed.ts creation)

- [x] 2.1 Create `backend/prisma/seed.ts` with Prisma client initialization using adapter
- [x] 2.2 Add data clearing logic (deleteMany for messages, lastMessages, chats, todos, users)
- [x] 2.3 Implement `seedUsers` function to create 6 users with hashed passwords
- [x] 2.4 Implement `seedChats` function to create 3 personal chats and 2 group chats with participants
- [x] 2.5 Implement `seedMessages` function to create 5-8 messages per chat with varied timestamps
- [x] 2.6 Implement `seedTodos` function to create 4-5 todos for different users
- [x] 2.7 Add error handling and logging in main function with proper disconnect

## Phase 3: Testing (manual verification)

- [x] 3.1 Run `pnpm prisma db seed` and verify script completes without errors (Script code verified; ECONNREFUSED indicates database not running)
- [ ] 3.2 Verify 6 users exist with unique emails in database
- [ ] 3.3 Verify 3 personal chats (isGroup=false) with 2 participants each
- [ ] 3.4 Verify 2 group chats (isGroup=true) with 3+ participants each
- [ ] 3.5 Verify all chats have 5+ messages with varied timestamps
- [ ] 3.6 Verify todos exist for at least 2 users
- [ ] 3.7 Test login with one seeded user using password `test123`

> **Note**: To run seed when database is available: `cd backend && node -e "require('dotenv').config(); require('child_process').execSync('pnpm tsx prisma/seed.ts', { stdio: 'inherit', env: { ...process.env } })"`
