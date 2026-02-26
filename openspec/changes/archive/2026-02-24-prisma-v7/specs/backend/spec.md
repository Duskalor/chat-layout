# Delta for Backend Database

## MODIFIED Requirements

### Requirement: Database Connection Initialization

The backend MUST establish a connection to the Prisma database before accepting HTTP requests. The system SHALL call `connectDatabase()` during server startup to verify database connectivity. The Prisma client SHALL be initialized using the new Prisma v7 TypeScript-based engine with configuration loaded from `prisma.config.ts`.

#### Scenario: Successful Database Connection on Startup

- GIVEN the `DATABASE_URL` environment variable is set with a valid PostgreSQL connection string
- AND the Prisma migration has been applied to create the database schema
- AND the `prisma.config.ts` file exists with valid datasource configuration
- WHEN the backend server starts (`node index.ts`)
- THEN the system SHALL call `connectDatabase()` to establish the database connection using the v7 client
- AND the server SHALL log a success message indicating the database is connected
- AND the HTTP server SHALL start listening on the configured port

#### Scenario: Database Connection Failure on Startup

- GIVEN the `DATABASE_URL` environment variable is not set or contains an invalid connection string
- WHEN the backend server starts
- THEN the system SHALL throw an error with a descriptive message indicating the database connection failed
- AND the HTTP server SHALL NOT start

#### Scenario: Missing DATABASE_URL Environment Variable

- GIVEN the `DATABASE_URL` is not defined in the environment
- WHEN the backend attempts to connect to the database
- THEN the system SHALL throw an error indicating the DATABASE_URL is required

### Requirement: Environment Configuration

The system MUST document all required environment variables in `.env.example`. The `.env.example` file SHALL include `DATABASE_URL` as a required configuration parameter. Additionally, the system MUST include `prisma generate` in the build process to regenerate the v7 client.

#### Scenario: DATABASE_URL Documented in .env.example

- GIVEN a new developer is setting up the project
- WHEN they refer to `.env.example` for configuration
- THEN they SHALL find `DATABASE_URL` listed with a placeholder connection string example

## ADDED Requirements

### Requirement: Prisma v7 Client Configuration

The system SHALL use Prisma v7 with the new TypeScript-based query engine. The Prisma client MUST be generated using the `prisma-client` generator provider instead of the legacy `prisma-client-js`.

#### Scenario: Generate Prisma v7 Client

- GIVEN the `prisma/schema.prisma` file contains the generator with `provider = "prisma-client"`
- AND the `prisma.config.ts` file is present in the prisma directory
- WHEN `npx prisma generate` is executed
- THEN the system SHALL generate a TypeScript-based Prisma client
- AND the generated client SHALL be located in `node_modules/.prisma/client`

#### Scenario: Prisma Client Initialization

- GIVEN the Prisma client has been generated with v7
- WHEN the application starts and calls `new PrismaClient()`
- THEN the client SHALL initialize using the configuration from `prisma.config.ts`
- AND the client SHALL support dynamic datasource configuration

### Requirement: Prisma Configuration File

The system SHALL create a `prisma.config.ts` file to configure the Prisma v7 datasource dynamically. This file MUST export a configuration object that defines the database connection settings.

#### Scenario: Prisma Config File Exists

- GIVEN the project requires Prisma v7
- WHEN the system looks for `prisma/prisma.config.ts`
- THEN the file SHALL exist and contain valid datasource configuration
- AND the configuration SHALL support the `DATABASE_URL` environment variable

### Requirement: Package Dependencies

The system MUST update `backend/package.json` to use Prisma v7.x packages. The `prisma` and `@prisma/client` packages SHALL be updated to version 7.x (currently 7.4.1).

#### Scenario: Dependencies Updated to v7

- GIVEN the backend `package.json` file
- WHEN the developer runs `pnpm install` to install dependencies
- THEN the `prisma` package version SHALL be 7.x
- AND the `@prisma/client` package version SHALL be 7.x

### Requirement: Schema Generator Provider Update

The system MUST update the Prisma schema generator from `prisma-client-js` to `prisma-client` to use the new TypeScript-based engine.

#### Scenario: Schema Generator Updated

- GIVEN the `prisma/schema.prisma` file
- WHEN the file is examined for the generator configuration
- THEN the generator SHALL specify `provider = "prisma-client"`
- AND NOT `provider = "prisma-client-js"`

## REMOVED Requirements

### Requirement: Legacy Prisma Client (Removed)

(Reason: Prisma v7 no longer supports the legacy Rust-based query engine. The old `prisma-client-js` generator is deprecated in favor of the new `prisma-client` TypeScript-based engine.)

The system SHALL NOT use the legacy `prisma-client-js` generator provider.

#### Scenario: Legacy Generator Not Used

- GIVEN the `prisma/schema.prisma` file
- WHEN generating the Prisma client
- THEN the system SHALL NOT use `provider = "prisma-client-js"`
- AND the system SHALL NOT include Rust engine binaries in the output

---

# Delta for Authentication Service

## MODIFIED Requirements

### Requirement: Authentication Service Database Integration

The authentication service MUST query user data from the Prisma database instead of mock data. The system SHALL use the Prisma client (v7) to find users by email and retrieve user information. The underlying database operations remain unchanged; only the client initialization differs.

#### Scenario: Login Queries Database for User

- GIVEN a user attempts to log in with an email and password
- WHEN the login endpoint is called
- THEN the system SHALL query the User table in the database using the provided email
- AND if a matching user exists, the system SHALL validate the password
- AND the system SHALL return the authenticated user's data from the database

#### Scenario: Login Fails for Non-existent User

- GIVEN a user attempts to log in with an email that does not exist in the database
- WHEN the login endpoint is called
- THEN the system SHALL return an unauthorized error
- AND the error message SHALL indicate invalid credentials

---

# Delta for Chat Service

## MODIFIED Requirements

### Requirement: Chat Service Database Integration

The chat service MUST query chat and message data from the Prisma database instead of mock data. The system SHALL use the Prisma client (v7) to retrieve user chats and messages. The underlying database operations remain unchanged; only the client initialization differs.

#### Scenario: Retrieve User Chats from Database

- GIVEN a user is authenticated and requests their chat list
- WHEN the system fetches the user's chats
- THEN the system SHALL query the Chat table in the database for chats where the user is a participant
- AND the system SHALL return all matching chats with their messages from the database

#### Scenario: Retrieve Chat Messages from Database

- GIVEN a user requests messages for a specific chat
- WHEN the system fetches the chat messages
- THEN the system SHALL query the Message table in the database for messages belonging to the chat
- AND the system SHALL return all matching messages from the database
