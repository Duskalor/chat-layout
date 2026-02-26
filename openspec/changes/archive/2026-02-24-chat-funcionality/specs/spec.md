# Chat Persistence Specification

## Purpose

This specification defines the requirements for persisting chat data to a PostgreSQL database using Prisma ORM. The system currently uses in-memory mock data for chat functionality, which prevents message persistence, breaks data consistency across server restarts, and prevents horizontal scaling.

## Requirements

### Requirement: Prisma Client Initialization

The backend MUST initialize a Prisma Client instance to connect to the PostgreSQL database. The client SHALL be configured as a singleton to prevent multiple connections during development hot-reloads.

#### Scenario: Prisma client connects successfully on server startup

- GIVEN the database server is running and accessible
- WHEN the backend server starts
- THEN the Prisma Client SHALL establish a connection to the database
- AND the server SHALL be ready to handle chat requests

#### Scenario: Prisma client fails to connect on server startup

- GIVEN the database server is unreachable or credentials are invalid
- WHEN the backend server starts
- THEN the server SHALL log a descriptive connection error
- AND the server SHALL NOT start (fail fast)

### Requirement: Message Persistence

The system MUST save every chat message to the database before broadcasting it via Socket.io. Messages SHALL be persisted with all required fields: id, text, chatId, senderId, and createdAt timestamp.

#### Scenario: Send and persist a new message

- GIVEN a user is connected to a chat room
- WHEN the user sends a message via the chat interface
- THEN the message SHALL be validated against the message schema
- AND the message SHALL be saved to the database with a generated UUID and timestamp
- AND the message SHALL be emitted to all connected clients in the room via Socket.io
- AND the chat's lastMessage SHALL be updated in the database

#### Scenario: Send message with invalid payload

- GIVEN a user sends a message with missing or invalid fields
- WHEN the message validation fails
- THEN the system SHALL return an error message
- AND the message SHALL NOT be saved to the database
- AND no socket event SHALL be emitted

#### Scenario: Database write fails but socket emit succeeds

- GIVEN a message passes validation
- WHEN the database write operation fails
- THEN the error SHALL be logged
- AND the socket emit SHALL NOT proceed (data consistency MUST be maintained)

### Requirement: Chat List Retrieval

The system MUST fetch chat conversations from the database instead of mock data. The chat list SHALL include participant details and the last message for each conversation.

#### Scenario: Retrieve user's chat list after login

- GIVEN a user has successfully authenticated
- WHEN the frontend requests the user's chat list
- THEN the system SHALL query the database for all chats where the user is a participant
- AND each chat SHALL include participant User objects
- AND each chat SHALL include the lastMessage object
- AND the list SHALL be returned to the client

#### Scenario: User has no existing chats

- GIVEN a user has no chat conversations in the database
- WHEN the user requests their chat list
- THEN the system SHALL return an empty array
- AND no error SHALL be thrown

### Requirement: Chat History Retrieval

The system MUST fetch message history for a specific chat from the database. Messages SHALL be ordered by creation timestamp (oldest first).

#### Scenario: Load chat history for existing conversation

- GIVEN a user opens an existing chat conversation
- WHEN the user requests the message history
- THEN the system SHALL query the database for all messages in that chat
- AND messages SHALL be sorted by createdAt in ascending order
- AND the message list SHALL be returned to the client

#### Scenario: Chat has no messages

- GIVEN a chat exists but has no messages
- WHEN a user requests the chat history
- THEN the system SHALL return an empty array
- AND no error SHALL be thrown

### Requirement: Field Naming Consistency

The system MUST ensure consistent field naming between the frontend types, backend types, and Prisma schema. All field names SHALL use camelCase for JavaScript/TypeScript and match the Prisma schema exactly.

#### Scenario: Verify chat field naming consistency

- GIVEN the frontend expects chat objects with specific field names
- WHEN data flows from database to frontend
- THEN the backend SHALL map Prisma fields to frontend-expected fields
- AND field names SHALL match exactly (e.g., chatId, not chatID)

#### Scenario: Frontend sends message with inconsistent field names

- GIVEN the frontend sends a message with field name "chatID" (PascalCase)
- WHEN the backend receives the message
- THEN the backend SHALL normalize field names to match the schema (chatId)
- OR return a validation error if normalization is not possible

### Requirement: Real-time Message Broadcasting

The system MUST continue to broadcast messages in real-time via Socket.io after persisting to the database. The socket event MUST include the complete message object with database-generated fields.

#### Scenario: Broadcast message to room after DB save

- GIVEN a message has been successfully saved to the database
- WHEN the save operation completes
- THEN the message SHALL be emitted to the appropriate Socket.io room
- AND all clients in the room SHALL receive the message in real-time

## Data Models

### Message (Database)

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key, auto-generated |
| text | String | Message content |
| createdAt | DateTime | Auto-generated timestamp |
| chatId | String | Foreign key to Chat |
| senderId | String | Foreign key to User |
| receiverId | String? | Optional foreign key to User |

### Chat (Database)

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key, auto-generated |
| name | String | Chat name |
| isGroup | Boolean | Group chat flag |
| createdAt | DateTime | Auto-generated timestamp |
| updatedAt | DateTime | Auto-updated timestamp |

### LastMessage (Database)

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| text | String | Last message content |
| senderId | String | User who sent last message |
| createdAt | String | ISO timestamp |
| chatId | String | Foreign key to Chat (unique) |

## API Contracts

### Socket Events

#### send_message (Client → Server)

```typescript
{
  chatId: string;  // MUST be camelCase
  text: string;
  senderId: string;
}
```

#### new_message (Server → Client)

```typescript
{
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;  // ISO 8601 format
}
```

#### get_chats (Client → Server)

```typescript
{
  userId: string;
}
```

#### chats_list (Server → Client)

```typescript
{
  chats: Array<{
    id: string;
    name: string;
    isGroup: boolean;
    participants: User[];
    lastMessage: {
      text: string;
      senderId: string;
      createdAt: string;
    };
  }>;
}
```

## Acceptance Criteria

- [ ] Prisma Client initializes on server startup and connects to database
- [ ] Messages are persisted to database before socket emission
- [ ] Chat list is fetched from database instead of mock arrays
- [ ] Chat history (messages) is fetched from database
- [ ] Field naming is consistent: `chatId`, `senderId` (camelCase throughout)
- [ ] Real-time broadcasting continues to work after DB integration
- [ ] Database connection failures are handled gracefully with proper error logging
- [ ] Frontend types align with backend types (createdAt/updatedAt, not createAt/updateAt)
