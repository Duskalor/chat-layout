# Design: Connect Prisma Database to Backend

## Technical Approach

Replace in-memory mock data in `auth.service.ts` and `chat.service.ts` with Prisma client queries using the existing `connectDatabase()` function from `backend/src/config/prisma.ts`. The Prisma client is already configured in `prisma.ts` with proper singleton pattern for development. This aligns with the proposal's approach of connecting the existing database infrastructure to the service layer.

## Architecture Decisions

### Decision: Prisma Connection in index.ts

**Choice**: Import and call `connectDatabase()` before starting the HTTP server
**Alternatives considered**: 
- Connect on first request (lazy initialization)
- Connect in a separate initialization module
**Rationale**: Fail-fast approach ensures the server doesn't accept requests if the database is unavailable. The existing `connectDatabase()` function in `prisma.ts` already handles this pattern with proper error handling.

### Decision: Service Layer Refactoring

**Choice**: Replace mock data arrays with Prisma queries directly in service files
**Alternatives considered**:
- Create a separate repository layer
- Use Prisma middleware for data transformation
**Rationale**: Minimal refactoring scope - the proposal specifically targets `auth.service.ts` and `chat.service.ts`. Creating additional layers would add unnecessary complexity for this change.

### Decision: Keep Prisma Client Singleton

**Choice**: Use existing singleton pattern from `prisma.ts`
**Alternatives considered**: Create new PrismaClient per request
**Rationale**: The existing pattern prevents connection exhaustion in development and follows Prisma best practices. Already implemented in `backend/src/config/prisma.ts`.

## Data Flow

### Database Connection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        index.ts                                 │
│                                                                 │
│  1. dotenv.config()                                             │
│         │                                                       │
│         ▼                                                       │
│  2. connectDatabase() ──► prisma.$connect()                    │
│         │                          │                            │
│         │                          ▼                            │
│         │                    PostgreSQL                         │
│         │                          │                            │
│         ▼                          ▼                            │
│  3. Express app starts ◄── success                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow with Database

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ auth.service │    │ user.service │    │   Prisma    │
│   .login()   │───►│findUserByEmail│───►│ user.find   │
│              │    │              │    │ .unique()   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Chat Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ chat.service │    │   Prisma    │    │   Database  │
│getUserChats()│───►│ chat.findMany│───►│   Tables    │
│              │    │ + include   │    │             │
└──────────────┘    └──────────────┘    └──────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/.env.example` | Modify | Add `DATABASE_URL=postgresql://user:password@localhost:5432/db` placeholder |
| `backend/src/index.ts` | Modify | Import `connectDatabase` from `./config/prisma.js`, call before `httpServer.listen()` |
| `backend/src/controllers/chat.controller.ts` | Modify | Refactor `sendMessage` to create message in database using Prisma |
| `backend/src/services/auth.service.ts` | Modify | Replace `findUserByEmail()` from user.service with Prisma query; import prisma client |
| `backend/src/services/user.service.ts` | Modify | Replace mock user array with Prisma `user.findUnique()` and `user.create()` |
| `backend/src/services/chat.service.ts` | Modify | Replace mock data with Prisma queries for chats, messages, participants |

## Interfaces / Contracts

### Prisma Client Usage

```typescript
// backend/src/config/prisma.ts - already exists
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
```

### Refactored user.service.ts

```typescript
import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../types/errors.js';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const createUser = async (data: { name: string; email: string; password: string }) => {
  return prisma.user.create({ data });
};
```

### Refactored chat.service.ts

```typescript
import { prisma } from '../config/prisma.js';

export const getUserChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { participants: { some: { id: userId } } },
    include: {
      participants: true,
      messages: { orderBy: { createdAt: 'asc' } },
      lastMessage: true,
    },
  });
};

export const getChatById = async (chatId: string) => {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: { participants: true, messages: true },
  });
};

export const createMessage = async (data: { text: string; chatId: string; senderId: string }) => {
  return prisma.message.create({ data });
};
```

### Refactored chat.controller.ts

```typescript
import { prisma } from '../config/prisma.js';

export const sendMessage = async (
  message: unknown,
  emitFn: (event: string, data: unknown) => void
): Promise<Message | { error: string }> => {
  try {
    const validatedMessage = parse(messageSchema, message) as Message;
    
    const createdMessage = await prisma.message.create({
      data: {
        text: validatedMessage.text,
        chatId: validatedMessage.chatId,
        senderId: validatedMessage.senderId,
      },
      include: { sender: true },
    });

    const messageWithTimestamp: Message = {
      id: createdMessage.id,
      text: createdMessage.text,
      chatId: createdMessage.chatId,
      senderId: createdMessage.senderId,
      createdAt: createdMessage.createdAt.toISOString(),
    };
    
    emitFn('new_message', messageWithTimestamp);
    return messageWithTimestamp;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid message payload';
    return { error: errorMessage };
  }
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Individual service methods | Mock Prisma client, test method logic |
| Integration | Database operations | Use test database, run actual queries |
| E2E | Full auth + chat flow | Test with real database, verify data persistence |

For this change, focus on:
1. Verify `connectDatabase()` is called before server starts
2. Login fetches user from database
3. Chat messages persist to database
4. Run `pnpm build` and `pnpm lint` to verify types and code quality

## Migration / Rollback

No data migration required - this change switches data sources without altering database schema. The migration `20260224000404_init` already exists.

**Rollback Steps** (if needed):
1. Remove `connectDatabase()` call from `index.ts`
2. Restore mock arrays in `user.service.ts`, `chat.service.ts`
3. Revert `.env.example` to remove DATABASE_URL

## Open Questions

- [ ] Should `user.service.ts` also implement `createUser()` for registration, or is that handled elsewhere?
- [ ] Should chat messages be created via Prisma in `chat.service.ts` or is there a separate controller handling it?
