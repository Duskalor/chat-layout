# Backend

## Purpose

This specification defines the requirements for the backend server, including database connectivity, authentication, API endpoints, error handling, and real-time communication.

## Scope

- Database connection initialization via Prisma
- Configuration requirements for environment variables
- Authentication service with JWT and password hashing
- Chat service for real-time messaging
- API endpoints for auth and chat
- Global error handling middleware
- Input validation
- Socket.io authentication
- Code quality requirements

## Requirements

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

The backend MUST load configuration from environment variables using `dotenv`. The system SHALL provide a `.env` file with JWT secret and CORS origin settings.

The system MUST document all required environment variables in `.env.example`. The `.env.example` file SHALL include `DATABASE_URL` as a required configuration parameter. Additionally, the system MUST include `prisma generate` in the build process to regenerate the v7 client.

#### Scenario: Backend Loads JWT Secret from Environment

- GIVEN the `.env` file exists with `JWT_SECRET=mysecretkey`
- WHEN the backend server starts
- THEN the server SHALL load `JWT_SECRET` from environment
- AND use it for JWT token operations

#### Scenario: Backend Loads CORS Origin from Environment

- GIVEN the `.env` file exists with `CORS_ORIGIN=http://localhost:5173`
- WHEN the backend server starts
- THEN the CORS middleware SHALL be configured with the specified origin
- AND NOT use wildcard `*`

#### Scenario: Backend Fails to Start without JWT Secret

- GIVEN the `.env` is missing or `JWT_SECRET` is not set
- WHEN the backend server starts
- THEN the server SHALL log a warning about missing JWT secret
- AND exit or use a fallback for development only

#### Scenario: DATABASE_URL Documented in .env.example

- GIVEN a new developer is setting up the project
- WHEN they refer to `.env.example` for configuration
- THEN they SHALL find `DATABASE_URL` listed with a placeholder connection string example

#### Scenario: Server Loads Environment Variables

- GIVEN a `.env` file exists
- WHEN the backend process starts
- THEN environment variables SHALL be loaded before server initialization
- AND configuration values SHALL come from environment

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

#### Scenario: Get Chat by ID from Database

- GIVEN a user requests a specific chat by ID
- WHEN the system fetches the chat
- THEN the system SHALL query the Chat table in the database for the matching chat ID
- AND the system SHALL return the chat with its participants and messages from the database

### Requirement: User Data Retrieval

The user data retrieval functionality SHALL now query the database instead of using in-memory arrays.

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

### Requirement: Input Validation with Valibot

The backend MUST validate all incoming API request bodies using Valibot schemas. The system SHALL reject invalid requests with structured error messages.

#### Scenario: Login Request Validates Email Format

- GIVEN the login endpoint expects email and password
- WHEN a client sends POST `/auth/login` with email "not-an-email"
- THEN the server SHALL return HTTP 400
- AND the response SHALL include validation error details
- AND indicate the email field is invalid

#### Scenario: Login Request Validates Password Presence

- GIVEN the login endpoint expects email and password
- WHEN a client sends POST `/auth/login` with missing password field
- THEN the server SHALL return HTTP 400
- AND the response SHALL indicate the password field is required

#### Scenario: Login Request Validates Email Presence

- GIVEN the login endpoint expects email and password
- WHEN a client sends POST `/auth/login` with missing email field
- THEN the server SHALL return HTTP 400
- AND the response SHALL indicate the email field is required

#### Scenario: Message Event Validates Required Fields

- GIVEN the Socket.io sendMessage event expects id, chatID, senderId, text
- WHEN a client emits 'sendMessage' with missing chatID
- THEN the server SHALL reject the message
- AND emit an error event back to the client

#### Scenario: Login Input Validated with Valibot

- GIVEN the login endpoint
- WHEN the client sends invalid email format
- THEN the server SHALL return HTTP 400 before any authentication attempt

### Requirement: Global Error Handling Middleware

The backend MUST implement a global error-handling middleware that catches all unhandled errors. The system SHALL return appropriate HTTP status codes and error messages.

#### Scenario: Unhandled Route Returns 404

- GIVEN the backend server is running
- WHEN a client makes a GET request to `/nonexistent`
- THEN the server SHALL return HTTP 404
- AND the response SHALL include a "Not Found" message

#### Scenario: Server Error Returns 500

- GIVEN an internal error occurs in a route handler
- WHEN the error propagates to the error handler
- THEN the server SHALL return HTTP 500
- AND the response SHALL include a generic "Internal Server Error" message
- AND log the detailed error for debugging

#### Scenario: Validation Error Returns 400

- GIVEN input validation fails in a route handler
- WHEN the Valibot validation error is caught
- THEN the server SHALL return HTTP 400
- AND the response SHALL include structured validation errors

### Requirement: JWT Authentication Middleware

The backend MUST implement JWT authentication middleware to protect API endpoints. The system SHALL validate tokens and extract user information.

#### Scenario: Protected Route Rejects Unauthenticated Request

- GIVEN a protected endpoint exists
- WHEN a client sends a request without Authorization header
- THEN the server SHALL return HTTP 401
- AND the response SHALL indicate authentication is required

#### Scenario: Protected Route Rejects Invalid Token

- GIVEN a protected endpoint exists
- WHEN a client sends a request with invalid JWT token
- THEN the server SHALL return HTTP 401
- AND the response SHALL indicate the token is invalid

#### Scenario: Protected Route Accepts Valid Token

- GIVEN a user has a valid JWT token
- WHEN the client sends a request with valid Authorization header
- THEN the server SHALL allow the request to proceed
- AND make user information available in the request

#### Scenario: JWT Token Contains User ID and Email

- GIVEN a user logs in successfully
- WHEN the server generates a JWT token
- THEN the token payload SHALL include `userId`
- AND include `email` field
- AND include `iat` (issued at) timestamp

### Requirement: Authentication Login Endpoint

The backend MUST validate login credentials using hashed passwords and return a JWT token. The endpoint SHALL use Valibot for input validation and bcrypt for password comparison.

#### Scenario: Successful Login Returns JWT Token

- GIVEN a user exists with email "test@test.com" and hashed password
- WHEN the client sends POST `/auth/login` with valid credentials
- THEN the server SHALL return HTTP 200
- AND the response SHALL include a valid JWT token (not a mock string)
- AND the token SHALL be signed with JWT_SECRET

### Requirement: CORS Origin Restriction

The backend MUST restrict CORS to specific origins instead of using wildcard. The system SHALL only allow requests from configured frontend origin.

#### Scenario: Request from Allowed Origin Succeeds

- GIVEN CORS_ORIGIN is set to `http://localhost:5173`
- WHEN a request comes from `http://localhost:5173`
- THEN the server SHALL include Access-Control-Allow-Origin header
- AND allow the request

#### Scenario: Request from Disallowed Origin Fails

- GIVEN CORS_ORIGIN is set to `http://localhost:5173`
- WHEN a request comes from `http://malicious-site.com`
- THEN the server SHALL NOT include Access-Control-Allow-Origin header
- AND the browser SHALL block the request

#### Scenario: Preflight Request from Allowed Origin Succeeds

- GIVEN CORS_ORIGIN is set to `http://localhost:5173`
- WHEN an OPTIONS preflight request comes from `http://localhost:5173`
- THEN the server SHALL respond with 200 OK
- AND include appropriate CORS headers

#### Scenario: CORS Restricted to Specific Origin

- GIVEN the `.env` file contains `CORS_ORIGIN`
- WHEN the backend processes a cross-origin request
- THEN the server SHALL set Access-Control-Allow-Origin to the configured value
- AND NOT set it to `*`

### Requirement: Password Hashing with Bcrypt

The backend MUST hash passwords using bcrypt before storage and compare hashed passwords during authentication. The system SHALL never store or compare plain-text passwords.

#### Scenario: Password Comparison Uses Bcrypt

- GIVEN a user record exists with bcrypt-hashed password
- WHEN a client provides a password for login
- THEN the server SHALL use bcrypt.compare() to validate
- AND NOT compare plain-text strings

#### Scenario: Login Fails for Wrong Password

- GIVEN a user exists with email "test@test.com" and hashed password
- WHEN the client sends POST `/auth/login` with correct email but wrong password
- THEN the server SHALL return HTTP 401
- AND the response SHALL NOT reveal whether email or password was wrong

#### Scenario: Plain-text Passwords Not Stored

- GIVEN new user registration is implemented
- WHEN the server stores a new user password
- THEN the password SHALL be hashed with bcrypt
- AND the plain-text password SHALL NOT be stored

### Requirement: Type Consistency for Timestamps

The backend MUST use consistent timestamp field naming across all TypeScript interfaces. The system SHALL use `createdAt` (camelCase) consistently.

#### Scenario: User Interface Uses createdAt

- GIVEN the User interface is defined
- WHEN the interface includes timestamp fields
- THEN the field SHALL be named `createdAt`
- AND NOT `createAt`

#### Scenario: Message Interface Uses createdAt

- GIVEN the Message interface is defined
- WHEN the interface includes timestamp fields
- THEN the field SHALL be named `createdAt`
- AND NOT `createAt`

#### Scenario: Chat Interface Uses createdAt

- GIVEN the Chat interface is defined
- WHEN the interface includes timestamp fields
- THEN the field SHALL be named `createdAt`
- AND NOT `createAt`

### Requirement: Async Error Handlers

The backend MUST use async/await wrappers for Express route handlers to properly catch errors. The system SHALL pass errors to next() for global error handling.

#### Scenario: Async Route Error Caught

- GIVEN an async route handler performs async operation
- WHEN the async operation throws an error
- THEN the error SHALL be caught automatically
- AND passed to the error handling middleware
- AND NOT crash the server

#### Scenario: Async Route Error Returns 500

- GIVEN an async route handler has an unhandled promise rejection
- WHEN the error is caught by the wrapper
- THEN the server SHALL return HTTP 500
- AND log the error details

### Requirement: Socket.io Authentication

The backend MUST authenticate Socket.io connections using JWT tokens. The system SHALL reject unauthenticated socket connections.

#### Scenario: Socket Connection Without Token Rejected

- GIVEN the Socket.io server requires authentication
- WHEN a client attempts to connect without a token
- THEN the server SHALL reject the connection
- AND emit a connection_error event

#### Scenario: Socket Connection With Invalid Token Rejected

- GIVEN the Socket.io server requires authentication
- WHEN a client connects with an invalid JWT token
- THEN the server SHALL reject the connection
- AND disconnect the client

#### Scenario: Socket Connection With Valid Token Accepted

- GIVEN the Socket.io server requires authentication
- WHEN a client connects with a valid JWT token
- THEN the server SHALL accept the connection
- AND make user information available in the socket

#### Scenario: Socket Authenticated Message Sending

- GIVEN an authenticated socket connection
- WHEN the client sends a 'sendMessage' event
- THEN the server SHALL verify the sender from the token
- AND NOT allow message spoofing
