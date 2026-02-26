# Delta for Chat

## ADDED Requirements

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
