# Proposal: Database Seed Script

## Intent

Populate the database with realistic test data to enable development, testing, and demo scenarios. The seed script will create users with varied profiles, personal chats between users, group chats with multiple participants, and sample todos - providing a comprehensive dataset for frontend development and manual testing.

## Scope

### In Scope
- Seed script at `backend/prisma/seed.ts` using Prisma's seeding feature
- 5-8 users with different profile characteristics (names, emails)
- 3-4 personal (1-on-1) chats between various users
- 2-3 group chats with 3+ participants each
- 5-10 messages per chat with varied timestamps
- Sample todos for 2-3 users
- Integration with package.json `prisma.seed` config
- npm/pnpm script to run the seed

### Out of Scope
- Automated tests for seed data
- Dynamic/environment-specific seed data
- Seed data versioning/migration
- Production seeding (dev environment only)

## Approach

1. Create `backend/prisma/seed.ts` using TypeScript with Prisma Client
2. Use bcrypt to hash passwords (use same hashed password for all test users)
3. Create users first, then chats with participant relations, then messages
4. Add prisma seed config to `package.json`
5. Add `pnpm db:seed` script
6. Document expected seed data in comments

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/prisma/seed.ts` | New | Main seed script file |
| `backend/package.json` | Modified | Add prisma.seed config and db:seed script |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Seed fails due to unique constraint violations | Low | Use `upsert` or clean data before seeding |
| Circular dependency in message relations | Low | Ensure users/chats created before messages |
| Password hashing performance | Low | Use simple hash (pre-hashed values acceptable for test data) |

## Rollback Plan

To remove seed data:
1. Run `pnpm prisma migrate reset` to reset database and clear all data
2. Or manually delete specific records via Prisma Studio (`pnpm prisma studio`)

## Dependencies

- Prisma Client (already in project)
- bcrypt package (already in project)
- PostgreSQL database running and accessible

## Success Criteria

- [ ] Seed script runs without errors via `pnpm prisma db seed`
- [ ] Database contains 5+ users with unique emails
- [ ] At least 3 personal chats exist between users
- [ ] At least 2 group chats exist with 3+ participants each
- [ ] All chats have sample messages
- [ ] Sample todos exist for multiple users
- [ ] All users can log in with test password
