# Delta for Backend Database

## ADDED Requirements

### Requirement: Database Connection Initialization

The backend MUST establish a connection to the Prisma database before accepting HTTP requests. The system SHALL call `connectDatabase()` during server startup to verify database connectivity.

#### Scenario: Successful Database Connection on Startup

- GIVEN the `DATABASE_URL` environment variable is set with a valid PostgreSQL connection string
- AND the Prisma migration has been applied to create the database schema
- WHEN the backend server starts (`node index.ts`)
- THEN the system SHALL call `connectDatabase()` to establish the database connection
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

The system MUST document all required environment variables in `.env.example`. The `.env.example` file SHALL include `DATABASE_URL` as a required configuration parameter.

#### Scenario: DATABASE_URL Documented in .env.example

- GIVEN a new developer is setting up the project
- WHEN they refer to `.env.example` for configuration
- THEN they SHALL find `DATABASE_URL` listed with a placeholder connection string example

### Requirement: Authentication Service Database Integration

The authentication service MUST query user data from the Prisma database instead of mock data. The system SHALL use the Prisma client to find users by email and retrieve user information.

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

### Requirement: Chat Service Database Integration

The chat service MUST query chat and message data from the Prisma database instead of mock data. The system SHALL use the Prisma client to retrieve user chats and messages.

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

#### Scenario: Get Chat by ID from Database

- GIVEN a user requests a specific chat by ID
- WHEN the system fetches the chat
- THEN the system SHALL query the Chat table in the database for the matching chat ID
- AND the system SHALL return the chat with its participants and messages from the database

## MODIFIED Requirements

### Requirement: User Data Retrieval

The user data retrieval functionality SHALL now query the database instead of using in-memory arrays.

(Previously: User data was stored in `mockUsers` array and searched using array methods)

#### Scenario: Find User by Email from Database

- GIVEN a system needs to find a user by their email address
- WHEN `findUserByEmail` is called with an email parameter
- THEN the system SHALL query the User table using Prisma
- AND return the first user matching the email, or undefined if not found

#### Scenario: Get User by ID from Database

- GIVEN a system needs to retrieve a user by their ID
- WHEN `getUserById` is called with a user ID
- THEN the system SHALL query the User table using Prisma
- AND return the user if found
- AND throw a NotFoundError if no user exists with that ID

### Requirement: Service Layer Data Access

The service layer (auth.service.ts and chat.service.ts) SHALL use Prisma client queries instead of mock data arrays for all data access operations.

(Previously: Services used in-memory arrays like `mockUsers`, `mockChats`, `mockMessages`)

#### Scenario: Login Uses Database

- GIVEN a login request is received
- WHEN the login handler processes the request
- THEN the system SHALL use `prisma.user.findUnique` to find the user
- AND SHALL NOT use any mock data arrays

#### Scenario: Get Chats Uses Database

- GIVEN a request to retrieve user chats is received
- WHEN the chat service processes the request
- THEN the system SHALL use `prisma.chat.findMany` with participant filter
- AND SHALL NOT use any mock data arrays
