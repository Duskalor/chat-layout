# Seed Data Specification

## Purpose

This specification defines the requirements for populating the database with realistic test data to enable development, testing, and demo scenarios. The seed script creates users with varied profiles, personal chats between users, group chats with multiple participants, messages, and sample todos.

## Scope

- Seed script at `backend/prisma/seed.ts` using Prisma's seeding feature
- 5-8 users with different profile characteristics (names, emails)
- 3-4 personal (1-on-1) chats between various users
- 2-3 group chats with 3+ participants each
- 5-10 messages per chat with varied timestamps
- Sample todos for 2-3 users
- Integration with package.json `prisma.seed` config
- npm/pnpm script to run the seed

## Requirements

### Requirement: Seed Script Location

The system MUST create a seed script at `backend/prisma/seed.ts` using TypeScript. The seed script SHALL use the Prisma Client to interact with the database.

#### Scenario: Seed Script Exists

- GIVEN the backend project directory exists
- WHEN the developer examines the `backend/prisma/` directory
- THEN a file named `seed.ts` SHALL exist
- AND the file SHALL be a valid TypeScript file

#### Scenario: Seed Script Uses Prisma Client

- GIVEN the seed script exists
- WHEN the script is executed
- THEN it SHALL import and use the Prisma Client
- AND it SHALL use the Prisma client to create database records

### Requirement: User Seed Data

The system MUST create 5-8 users with unique emails and names. The seed data SHALL include varied profile characteristics for realistic testing.

#### Scenario: Create Multiple Users

- GIVEN the seed script executes
- WHEN creating user records
- THEN the system SHALL create at least 5 users
- AND each user SHALL have a unique email address
- AND each user SHALL have a name field populated

#### Scenario: User Password Hashing

- GIVEN users are being created in the seed script
- WHEN the seed script creates user records
- THEN passwords SHALL be hashed using bcrypt
- AND the same hashed password MAY be used for all test users
- AND all test users SHALL be able to log in with a known test password

#### Scenario: Unique Email Constraint

- GIVEN the database already contains users
- WHEN the seed script runs again
- THEN the script SHALL handle unique constraint violations gracefully
- OR the script SHALL clean existing data before seeding

### Requirement: Personal Chat Seed Data

The system MUST create 3-4 personal (1-on-1) chats between various users. Personal chats SHALL have exactly 2 participants and `isGroup` set to false.

#### Scenario: Create Personal Chats

- GIVEN users exist in the database
- WHEN the seed script creates chat records
- THEN the system SHALL create at least 3 personal chats
- AND each personal chat SHALL have exactly 2 participants
- AND each personal chat SHALL have `isGroup` set to false

#### Scenario: Personal Chat Has Participants

- GIVEN the seed script creates a personal chat
- WHEN the chat is created
- THEN the system SHALL link exactly 2 User records to the chat
- AND both users SHALL be different

### Requirement: Group Chat Seed Data

The system MUST create 2-3 group chats with 3+ participants each. Group chats SHALL have `isGroup` set to true and a group name.

#### Scenario: Create Group Chats

- GIVEN users exist in the database
- WHEN the seed script creates chat records
- THEN the system SHALL create at least 2 group chats
- AND each group chat SHALL have `isGroup` set to true
- AND each group chat SHALL have a name

#### Scenario: Group Chat Participants

- GIVEN the seed script creates a group chat
- WHEN the chat is created
- THEN the system SHALL link at least 3 User records to the chat
- AND the participants SHALL be different users

### Requirement: Message Seed Data

The system MUST create 5-10 messages per chat with varied timestamps. Messages SHALL include text content, sender, and proper timestamps.

#### Scenario: Messages Per Chat

- GIVEN chats exist in the database
- WHEN the seed script creates message records
- THEN each chat SHALL have at least 5 messages
- AND each message SHALL have text content

#### Scenario: Message Timestamps

- GIVEN messages are being created
- WHEN the seed script creates message records
- THEN messages SHALL have `createdAt` timestamps
- AND timestamps SHOULD be varied to simulate realistic conversation flow

#### Scenario: Message Relations

- GIVEN a message is created
- WHEN the message is stored in the database
- THEN the message SHALL have a valid `chatId` reference
- AND the message SHALL have a valid `senderId` reference

### Requirement: Todo Seed Data

The system MUST create sample todos for 2-3 users. Todo records SHALL have title, completed status, and user association.

#### Scenario: Create Todos for Users

- GIVEN users exist in the database
- WHEN the seed script creates todo records
- THEN the system SHALL create todos for at least 2 users
- AND each todo SHALL have a title
- AND each todo SHALL have a `userId` reference

#### Scenario: Todo Completion Status

- GIVEN todos are being created
- WHEN the seed script creates todo records
- THEN some todos SHALL have `completed` set to true
- AND some todos SHALL have `completed` set to false

### Requirement: Package.json Integration

The system MUST integrate with Prisma's seeding feature by configuring `prisma.seed` in `backend/package.json`. The system SHALL also provide a npm/pnpm script to run the seed.

#### Scenario: Prisma Seed Configuration

- GIVEN the backend `package.json` file exists
- WHEN the developer examines the file
- THEN the file SHALL contain a `prisma.seed` configuration
- AND the configuration SHALL point to the seed script

#### Scenario: Seed Script npm Command

- GIVEN the backend `package.json` is configured
- WHEN the developer runs `pnpm prisma db seed`
- THEN the seed script SHALL execute
- AND database records SHALL be created

### Requirement: Seed Execution Order

The seed script MUST create records in the correct order to satisfy foreign key constraints. Users SHALL be created before chats, and chats before messages.

#### Scenario: Users Created First

- GIVEN the seed script executes
- WHEN creating database records
- THEN all User records SHALL be created before Chat records
- AND this order SHALL prevent foreign key constraint violations

#### Scenario: Chats Created Before Messages

- GIVEN the seed script executes
- WHEN creating database records
- THEN all Chat records SHALL be created before Message records
- AND this order SHALL prevent foreign key constraint violations

### Requirement: Seed Data Idempotency

The seed script SHOULD handle repeated executions gracefully. The script MAY use upsert operations or clean existing data before seeding.

#### Scenario: Running Seed Multiple Times

- GIVEN the seed script has been executed once
- WHEN the seed script runs again
- THEN the script SHALL NOT fail due to unique constraint violations
- OR the script SHALL handle existing data appropriately

---

## Acceptance Criteria

- [ ] Seed script exists at `backend/prisma/seed.ts`
- [ ] Database contains 5+ users with unique emails after seeding
- [ ] At least 3 personal chats exist between users after seeding
- [ ] At least 2 group chats exist with 3+ participants after seeding
- [ ] All chats have 5+ sample messages after seeding
- [ ] Sample todos exist for multiple users after seeding
- [ ] All users can log in with test password after seeding
- [ ] Seed runs successfully via `pnpm prisma db seed`
