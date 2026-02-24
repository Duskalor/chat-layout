# Chat Functionality Backend Specification

## Purpose

This specification defines the backend requirements for integrating the chat functionality with a PostgreSQL database using Prisma ORM. The changes ensure messages are persisted, chats are retrievable from the database, and field naming is consistent across the backend and frontend.

## Requirements

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

The backend MUST save messages to the database before emitting them via socket to ensure data durability.

#### Scenario: Message Saved Before Socket Emit

- GIVEN a user sends a message through the chat interface
- WHEN the chat controller receives the message payload
- THEN the message SHALL be persisted to the database using Prisma
- AND the saved message SHALL include a generated ID and timestamp
- AND the message SHALL be emitted via socket only after successful database save
- AND the client SHALL receive the message with the persisted data

#### Scenario: Message Save Fails

- GIVEN a user sends a message but database write fails
- WHEN the chat controller attempts to persist the message
- THEN the database operation SHALL throw an error
- AND the message SHALL NOT be emitted via socket
- AND an error response SHALL be returned to the sender

#### Scenario: Message Validation Before Save

- GIVEN a user sends a message with invalid payload
- WHEN the chat controller validates the message schema
- THEN invalid messages SHALL be rejected before database insertion
- AND an error message SHALL be returned to the sender

### Requirement: Chat Fetching from Database

The backend MUST retrieve chats and their messages from the database instead of mock data.

#### Scenario: Get User Chats from Database

- GIVEN a user requests their chat list
- WHEN the chat service receives a userId request
- THEN the service SHALL query the database for chats where the user is a participant
- AND the returned chats SHALL include related participants and last message
- AND the result SHALL be returned to the client

#### Scenario: Get Chat Messages from Database

- GIVEN a user requests messages for a specific chat
- WHEN the chat service receives a chatId request
- THEN the service SHALL query the database for messages in that chat
- AND messages SHALL be ordered by creation time ascending
- AND the result SHALL be returned to the client

#### Scenario: Get Chat by ID from Database

- GIVEN a user requests a specific chat by ID
- WHEN the chat service receives a chatId
- THEN the service SHALL query the database for that chat
- AND the chat SHALL include related participants and messages
- AND the result SHALL be returned or undefined if not found

### Requirement: Field Naming Consistency

The backend MUST use consistent field names between TypeScript types, Prisma schema, and API responses.

#### Scenario: Message Field Names Match Schema

- GIVEN a message is retrieved from or sent to the database
- WHEN the data is transformed between layers
- THEN field names SHALL match the Prisma schema exactly (chatId, senderId)
- AND the API SHALL use `chatId` (not `chatID`) consistently

#### Scenario: Chat Field Names Match Schema

- GIVEN a chat is retrieved from or sent to the database
- WHEN the data is transformed between layers
- THEN field names SHALL match the Prisma schema exactly (createdAt, updatedAt)
- AND the API SHALL use `createdAt` and `updatedAt` (not `createAt`/`updateAt`)

### Requirement: Socket Integration with Database

The backend MUST ensure socket event handlers use the database-backed service methods.

#### Scenario: Socket Connection Uses Database Service

- GIVEN a socket client connects and requests chat data
- WHEN socket handlers invoke chat service methods
- THEN the service SHALL return data from the database
- AND the socket SHALL emit responses with database-backed data

#### Scenario: New Message Broadcast with Database Data

- GIVEN a message is successfully saved to the database
- WHEN the chat controller emits the message via socket
- THEN all connected clients in the chat room SHALL receive the message
- AND the message data SHALL match the persisted database record
