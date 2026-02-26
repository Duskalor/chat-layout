# Design: Database Seed Script

## Technical Approach

The seed script will be implemented as a standalone TypeScript file (`backend/prisma/seed.ts`) using Prisma Client with PostgreSQL adapter. The approach follows Prisma's recommended seeding workflow with the following execution order:

1. **Users first** - Create all users with hashed passwords
2. **Chats second** - Create personal and group chats with participant relations
3. **Messages third** - Create messages linked to chats and senders
4. **Todos last** - Create todos linked to users

This ensures foreign key constraints are satisfied at each step. The script will use `upsert` operations to handle idempotency.

## Architecture Decisions

### Decision: Seed Script Location and Entry Point

**Choice**: Use `backend/prisma/seed.ts` as the seed script location with Prisma seeding configured in package.json
**Alternatives considered**: Using `prisma/seed.js`, using a separate npm script without prisma.seed config
**Rationale**: Prisma's native seeding feature (`prisma.seed` in package.json) is the recommended approach for TypeScript projects and provides `pnpm prisma db seed` command out of the box

### Decision: Password Handling

**Choice**: Use bcrypt with a pre-computed hash (constant for all test users)
**Alternatives considered**: Generate unique hashes per user, use plain text
**Rationale**: Using the same pre-computed hash avoids performance overhead during seeding while allowing all test users to log in with a known password (`test123`)

### Decision: Prisma Client Initialization

**Choice**: Use the existing Prisma client setup from `src/config/prisma.ts` but create a simplified version for seeding
**Alternatives considered**: Import from existing config module
**Rationale**: The existing config has environment-specific logic (global singleton) that may cause issues in seed scripts. A direct instantiation ensures clean execution

### Decision: Idempotency Strategy

**Choice**: Use `deleteMany` before creating data to ensure clean seeding
**Alternatives considered**: Use upsert operations, check for existing data
**Rationale**: Simpler and more reliable for development - ensures clean state every time seed runs

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Seed Script                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Connect to Prisma (PostgreSQL adapter)                      │
│                           │                                      │
│  2. Clear existing data (deleteMany)                            │
│         │              │              │                         │
│         ▼              ▼              ▼                         │
│    Messages         Chats          Todos          Users          │
│    (dependent)     (dependent)    (dependent)    (independent)   │
│                           │                                      │
│  3. Create Users ─────────┼─────────────────────────────────────► │
│         │                  │                                      │
│         ▼                  ▼                                      │
│  4. Create Chats ─────────┴────────────────────────────────────► │
│         │                                                        │
│         ▼                                                        │
│  5. Create Messages ─────────────────────────────────────────► │
│         │                                                        │
│         ▼                                                        │
│  6. Create Todos ─────────────────────────────────────────────► │
│                           │                                      │
│  7. Disconnect                                                          │
└─────────────────────────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/prisma/seed.ts` | Create | Main seed script with all seed data |
| `backend/package.json` | Modify | Add prisma.seed config and db:seed script |

## Seed Data Specification

### Users (6 total)

| Name | Email | Password (hashed) |
|------|-------|-------------------|
| Alice Johnson | alice@example.com | $2a$10$... (test123) |
| Bob Smith | bob@example.com | $2a$10$... (test123) |
| Charlie Brown | charlie@example.com | $2a$10$... (test123) |
| Diana Prince | diana@example.com | $2a$10$... (test123) |
| Edward Norton | edward@example.com | $2a$10$... (test123) |
| Fiona Apple | fiona@example.com | $2a$10$... (test123) |

### Personal Chats (3 total)

| Chat Name | Participants | isGroup |
|-----------|--------------|---------|
| Alice & Bob | Alice, Bob | false |
| Charlie & Diana | Charlie, Diana | false |
| Alice & Fiona | Alice, Fiona | false |

### Group Chats (2 total)

| Chat Name | Participants | isGroup |
|-----------|--------------|---------|
| Team Alpha | Alice, Bob, Charlie | true |
| Project Beta | Diana, Edward, Fiona, Alice | true |

### Messages (5-8 per chat)

Sample message content:
- Personal chats: Casual conversation topics (weekend plans, work updates, hobbies)
- Group chats: Project discussions, meeting notes, random chat

### Todos (4-5 total)

| Title | Completed | User |
|-------|-----------|------|
| Buy groceries | false | Alice |
| Complete project report | true | Bob |
| Call dentist | false | Charlie |
| Review PR #42 | true | Diana |
| Plan team meeting | false | Bob |

## Interfaces / Contracts

### Seed Script Entry Point

```typescript
// backend/prisma/seed.ts
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.lastMessage.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    // Seed data creation functions...
    await seedUsers(prisma);
    await seedChats(prisma);
    await seedMessages(prisma);
    await seedTodos(prisma);

    console.log('Seed completed successfully');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

### Package.json Configuration

```json
{
  "prisma": {
    "seed": "tsx backend/prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "prisma db seed"
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | All users can log in | Login with each user using test123 password |
| Manual | Chats load correctly | Check chat list for each user |
| Manual | Messages display | Verify message content in chats |
| Manual | Todos display | Check todo list for users with todos |

**No automated tests** for seed data as per proposal scope.

## Migration / Rollback

No migration required - seed script is development-only.

**Rollback**: Run `pnpm prisma migrate reset` to clear all data, or manually delete via Prisma Studio.

## Open Questions

- [ ] None - all requirements are clear from proposal and specs
