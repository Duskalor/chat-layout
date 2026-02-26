# Structured Output: Seed Specs

## Status

**Status**: Completed

## Executive Summary

Created detailed specifications for the Database Seed Script change. The spec defines requirements for populating the database with realistic test data including 5-8 users, 3-4 personal chats, 2-3 group chats with 3+ participants, 5-10 messages per chat, and sample todos for 2-3 users. The seed integrates with Prisma's seeding feature via package.json configuration.

## Detailed Report

The seed specification covers:
- **Seed Script Location**: TypeScript seed script at `backend/prisma/seed.ts`
- **User Seed Data**: 5-8 users with unique emails, bcrypt-hashed passwords
- **Personal Chats**: 3-4 one-on-one chats with 2 participants each
- **Group Chats**: 2-3 group chats with 3+ participants
- **Message Seed Data**: 5-10 messages per chat with varied timestamps
- **Todo Seed Data**: Sample todos for 2-3 users
- **Package Integration**: `prisma.seed` config and `pnpm db:seed` script
- **Execution Order**: Users → Chats → Messages (to satisfy FK constraints)

## Artifacts

| Artifact | Path |
|----------|------|
| Seed Specification | `openspec/changes/seed/specs/seed.md` |

## Next Recommended

Ready for design (sdd-design). The design phase should:
- Determine exact user names/emails for seed data
- Define group chat names
- Create sample message content
- Decide on specific todo titles

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Seed fails due to unique constraint violations | Low | Use `upsert` or clean data before seeding |
| Circular dependency in message relations | Low | Ensure users/chats created before messages |
| Password hashing performance | Low | Use pre-hashed values or simple hash for test data |
