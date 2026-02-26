# Design: Chat Functionality Database Integration

## Technical Approach

Implement **Full Prisma Integration** to replace in-memory mock data with persistent PostgreSQL storage. The approach involves:
1. Creating a Prisma client singleton in a dedicated config module
2. Adding database connection verification on startup
3. Rewriting `chat.service.ts` to use Prisma queries instead of mock arrays
4. Updating `chat.controller.ts` to persist messages before socket emission with proper field normalization
5. Fixing field naming mismatches between frontend (`chatID`, `userID`, `createAt`) and backend/Prisma (`chatId`, `senderId`, `createdAt`)

## Architecture Decisions

### Decision: Prisma Client Singleton Pattern

**Choice**: Create a dedicated `backend/src/config/prisma.ts` with singleton PrismaClient export
**Alternatives considered**: 
- Add Prisma client directly to existing `config/index.ts` (mixes concerns)
- Create new client per request (connection exhaustion)
- Use factory function with caching (unnecessary complexity)

**Rationale**: ES modules are cached per-process, so exporting `new PrismaClient()` ensures a single connection pool. This matches Prisma's official recommendation and prevents connection exhaustion under load. Keeping it in a separate module follows separation of concerns.

### Decision: Database Connection Verification

**Choice**: Add async connection verification in `backend/src/index.ts` before server starts, with graceful error handling that logs but allows continuation
**Alternatives considered**:
- Block server startup on DB connection (too strict for development)
- No connection check (risky for production)

**Rationale**: Logging connection status provides visibility without blocking development workflows. Production deployments can validate externally.

### Decision: Field Naming Strategy

**Choice**: Normalize frontend field names (`chatID` → `chatId`, `userID` → `senderId`, `createAt` → `createdAt`) in the controller before validation
**Alternatives considered**:
- Change frontend types to match backend (breaks existing frontend code)
- Change Prisma schema (deviates from Prisma conventions)

**Rationale**: Minimal frontend changes required. The mapping is explicit in the controller and easy to maintain. Frontend continues sending `chatID`, backend normalizes it server-side.

### Decision: Message Persistence Flow

**Choice**: Save message to DB in controller, then emit via socket only after successful save
**Alternatives considered**: 
- Emit first then save asynchronously (message could be lost if DB fails)
- Fire-and-forget save (no error handling for client)

**Rationale**: Ensures message is persisted before user sees confirmation. If DB write fails, sender gets error and no inconsistent state occurs.

## Data Flow

### Message Sending Sequence Diagram

```
┌──────────┐   Socket.io    ┌──────────────┐   ┌─────────────┐   ┌─────────┐
│ Client   │────────────────│   index.ts   │───│ controller  │───│ Prisma  │
└──────────┘                └──────────────┘   └─────────────┘   └─────────┘
                                                           │           │
                                                           │           │
  1. sendMessage({chatID, userID, text})                   │           │
       │                                                   │           │
       ├──────────────────────────────────────────────────>│           │
       │                    2. normalizeFields()           │           │
       │                    chatID → chatId               │           │
       │                    userID → senderId              │           │
       │                           │                       │           │
       │                           ├──────────────────────>│           │
       │                           │  3. validate(messageSchema)       │
       │                           │                       │           │
       │                           │  4. prisma.message.create()       │
       │                           │                       ├──────────>│
       │                           │                       │    5. INSERT     │
       │                           │                       │<───────────┤
       │                           │   6. savedMessage     │           │
       │                           │<──────────────────────┤           │
       │                    7. emitFn('new_message', msg) │           │
       │<──────────────────────────────────────────────────┤           │
       │                    8. io.emit('new_message', msg) │           │
       ├──────────────────────────────────────────────────┤           │
       │                                                   │           │
```

### Full Data Flow Diagram

```
 Frontend Socket
      │
      ▼
index.ts (socket handler)
      │
      ▼
chat.controller.ts (sendMessage)
      │
      ├──────────────────┐
      ▼                  ▼
prisma.message.create  socket.emit('new_message')
      │                  │
      └──────────────────┘
            │
            ▼
     All Connected Clients
```

### Chat Fetching Flow

```
 Client Socket
      │
      ▼
index.ts ('connected' handler)
      │
      ▼
chat.controller.ts (getChats)
      │
      ▼
chat.service.ts (getUserChats)
      │
      ▼
prisma.chat.findMany({
  where: { participants: { some: { id: userId } } },
  include: { participants, messages, lastMessage }
})
      │
      ▼
Return Chat[] to socket
      │
      ▼
socket.emit('messages', { chats: [...] })
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/config/prisma.ts` | Create | PrismaClient singleton with connection helper |
| `backend/src/config/index.ts` | Modify | Add DATABASE_URL to AppConfig interface |
| `backend/src/services/chat.service.ts` | Modify | Replace mock arrays with async Prisma queries |
| `backend/src/controllers/chat.controller.ts` | Modify | Add field normalization and DB save before emit |
| `backend/src/middleware/validate.ts` | Modify | Make `id` optional in messageSchema (DB auto-generates) |
| `backend/src/index.ts` | Modify | Add Prisma connection verification on startup |
| `frontend/src/assets/types/messages.type.ts` | Modify (optional) | Add mapping utilities or update types to match backend |

## Interfaces / Contracts

### New Prisma Config Module (backend/src/config/prisma.ts)

```typescript
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

### Updated Config Interface (backend/src/config/index.ts)

```typescript
export interface AppConfig {
  port: number;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;  // Add DATABASE_URL
}
```

### Updated Chat Service (backend/src/services/chat.service.ts)

```typescript
import { prisma } from '../config/prisma.js';
import { Chat, Message, User } from '../types/index.js';

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const chats = await prisma.chat.findMany({
    where: {
      participants: { some: { id: userId } }
    },
    include: {
      participants: true,
      messages: { orderBy: { createdAt: 'asc' } },
      lastMessage: true
    }
  });

  return chats.map(mapChatFromPrisma);
};

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      participants: true,
      messages: { orderBy: { createdAt: 'asc' } },
      lastMessage: true
    }
  });
  return chat ? mapChatFromPrisma(chat) : null;
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' }
  });
  return messages.map(mapMessageFromPrisma);
};

export const createMessage = async (data: {
  chatId: string;
  senderId: string;
  text: string;
}): Promise<Message> => {
  const message = await prisma.message.create({ data });
  
  await prisma.lastMessage.upsert({
    where: { chatId: data.chatId },
    update: {
      text: data.text,
      senderId: data.senderId,
      createdAt: new Date().toISOString(),
    },
    create: {
      chatId: data.chatId,
      text: data.text,
      senderId: data.senderId,
      createdAt: new Date().toISOString(),
    },
  });

  return mapMessageFromPrisma(message);
};

// Mapping helpers to convert Prisma types to app types
function mapChatFromPrisma(chat: Awaited<ReturnType<typeof prisma.chat.findUnique>>): Chat {
  const c = chat as Awaited<ReturnType<typeof prisma.chat.findUnique>>;
  return {
    id: c!.id,
    name: c!.name,
    isGroup: c!.isGroup,
    participants: c!.participants as User[],
    messages: c!.messages.map(mapMessageFromPrisma),
    createdAt: c!.createdAt,
    updatedAt: c!.updatedAt,
    lastMessage: c!.lastMessage,
  };
}

function mapMessageFromPrisma(m: { id: string; chatId: string; senderId: string; text: string; createdAt: Date }): Message {
  return {
    id: m.id,
    chatId: m.chatId,
    senderId: m.senderId,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
  };
}
```

### Updated Controller with Field Normalization (backend/src/controllers/chat.controller.ts)

```typescript
import { parse } from 'valibot';
import { getUserChats, createMessage } from '../services/chat.service.js';
import { messageSchema } from '../middleware/validate.js';
import { Chat, Message } from '../types/index.js';

const normalizeMessageFields = (msg: Record<string, unknown>): Record<string, unknown> => {
  return {
    ...msg,
    chatId: msg.chatID ?? msg.chatId,
    senderId: msg.userID ?? msg.senderId,
    createdAt: msg.createAt ?? msg.createdAt ?? new Date().toISOString(),
  };
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  return getUserChats(userId);
};

export const sendMessage = async (
  message: unknown,
  emitFn: (event: string, data: unknown) => void
): Promise<Message | { error: string }> => {
  try {
    const normalized = normalizeMessageFields(message as Record<string, unknown>);
    const validatedMessage = parse(messageSchema, normalized) as Message;
    
    const savedMessage = await createMessage({
      chatId: validatedMessage.chatId,
      senderId: validatedMessage.senderId,
      text: validatedMessage.text,
    });
    
    emitFn('new_message', savedMessage);
    return savedMessage;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid message payload';
    return { error: errorMessage };
  }
};
```

### Updated index.ts with Connection Verification (backend/src/index.ts)

```typescript
import { connectDatabase } from './config/prisma.js';

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.warn('Failed to connect to database, continuing anyway:', error);
  }

  httpServer.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

startServer();
```

### Updated Message Schema (backend/src/middleware/validate.ts)

```typescript
export const messageSchema = object({
  id: optional(string()),  // Made optional - DB generates ID
  chatId: pipe(string(), minLength(1, 'chatId is required')),
  senderId: string(),
  text: pipe(string(), minLength(1, 'Text is required')),
});
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|--------------|----------|
| Unit | Chat service functions return correct Prisma query results | Mock Prisma client |
| Integration | Full flow: socket → controller → DB → emit | Test with real database |
| E2E | User sends message, sees it persisted | Cypress/Playwright |

## Migration / Rollout

1. **Pre-deployment**: Run `npx prisma db push` to sync schema
2. **Phase 1**: Deploy backend with Prisma integration and field normalization
3. **Phase 2**: Verify socket events work with existing frontend (mapping handles field differences)
4. **Fallback**: Revert to mock arrays if critical DB issues occur

**No data migration required** - new tables created fresh.

## Open Questions

- [x] Should we add database connection error handling in the socket layer? → **Yes, graceful handling with warning log**
- [x] How to handle frontend/backend field naming mismatch? → **Normalize in controller (chatID→chatId, userID→senderId)**
- [ ] Is there a need for chat creation from the frontend? (out of scope, but clarify roadmap)
- [ ] Should we use transactions for message create + lastMessage update? (currently uses upsert, single query)
