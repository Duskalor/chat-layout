# Chat Persistence

## Purpose

This specification defines the requirements for storing chat data in the PostgreSQL database instead of in-memory mock data, ensuring data persistence across server restarts.

## Scope

- Chat data persistence via Prisma
- Message storage in database
- Retrieval of chats and messages from database

## Requirements

### Requirement: Chat Data Persistence

The system SHALL store chat data in the PostgreSQL database instead of in-memory mock data. All chat operations MUST query the database.

#### Scenario: Retrieve User Chats from Database

- GIVEN a user with ID exists in the database
- AND the user has associated chats in the database
- WHEN the system requests chats for the user
- THEN the system SHALL query the Chat table with Prisma
- AND the system SHALL return all chats where the user is a participant
- AND each chat SHALL include its messages and participants

#### Scenario: Retrieve Chat Messages from Database

- GIVEN a chat exists in the database with messages
- WHEN the system requests messages for a specific chat
- THEN the system SHALL query the Message table filtered by chatId
- AND the messages SHALL be returned in chronological order by createdAt
- AND each message SHALL include sender information

#### Scenario: Chat Persists After Server Restart

- GIVEN a chat was created and stored in the database
- WHEN the backend server restarts
- THEN the chat data SHALL remain in the database
- AND subsequent requests for the chat SHALL return the persisted data
- AND the data SHALL NOT be lost

### Requirement: Message Storage

The system SHALL store new messages in the database when sent through the chat service.

#### Scenario: New Message Saved to Database

- GIVEN a chat exists in the database
- WHEN a user sends a message to the chat
- THEN the system SHALL create a new Message record in the database
- AND the message SHALL include text, senderId, chatId, and createdAt
- AND the message SHALL be retrievable immediately after creation

### Requirement: Prisma Client Initialization

The backend MUST initialize a singleton instance of the PrismaClient to manage database connections efficiently.

#### Scenario: Prisma Client Singleton Created on Startup

- GIVEN the backend server starts
- WHEN the application loads the Prisma client module
- THEN a single PrismaClient instance SHALL be created and exported
- AND subsequent imports of the Prisma client SHALL return the same instance

#### Scenario: Prisma Client Handles Multiple Import Contexts

- GIVEN the backend server is running with the Prisma singleton
- WHEN multiple modules import the Prisma client
- THEN each module SHALL receive the same client instance
- AND no new database connections SHALL be created

### Requirement: Database Connection Verification

The backend MUST verify the database connection on startup to ensure the application can persist and retrieve data.

#### Scenario: Database Connection Successful

- GIVEN a valid DATABASE_URL is configured in environment variables
- WHEN the backend starts and attempts to connect to the database
- THEN the connection SHALL succeed without errors
- AND the server SHALL log a success message indicating database availability

#### Scenario: Database Connection Fails

- GIVEN an invalid or unreachable DATABASE_URL is configured
- WHEN the backend starts and attempts to connect to the database
- THEN the connection attempt SHALL throw an error
- AND the server SHALL log an appropriate error message
- AND the server SHOULD NOT start or SHALL handle the error gracefully

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

- [x] Prisma Client initializes on server startup and connects to database
- [x] Messages are persisted to database before socket emission
- [x] Chat list is fetched from database instead of mock arrays
- [x] Chat history (messages) is fetched from database
- [x] Field naming is consistent: `chatId`, `senderId` (camelCase throughout)
- [x] Real-time broadcasting continues to work after DB integration
- [x] Database connection failures are handled gracefully with proper error logging
- [x] Frontend types align with backend types (createdAt/updatedAt, not createAt/updateAt)
