# Delta for Backend

## ADDED Requirements

### Requirement: Environment Configuration

The backend MUST load configuration from environment variables using `dotenv`. The system SHALL provide a `.env` file with JWT secret and CORS origin settings.

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

- GIVEN the `.env` file is missing or `JWT_SECRET` is not set
- WHEN the backend server starts
- THEN the server SHALL log a warning about missing JWT secret
- AND exit or use a fallback for development only

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

## MODIFIED Requirements

### Requirement: CORS Configuration

The backend MUST configure CORS to allow requests from the frontend origin. The server SHALL NOT use wildcard `*` for origin.

(Previously: The backend MUST configure CORS to allow requests from the frontend. The server SHALL accept requests from any origin (`*`) and support GET and POST methods.)

#### Scenario: CORS Restricted to Specific Origin

- GIVEN the `.env` file contains `CORS_ORIGIN`
- WHEN the backend processes a cross-origin request
- THEN the server SHALL set Access-Control-Allow-Origin to the configured value
- AND NOT set it to `*`

---

### Requirement: Authentication Login Endpoint

The backend MUST validate login credentials using hashed passwords and return a JWT token. The endpoint SHALL use Valibot for input validation and bcrypt for password comparison.

(Previously: The backend MUST provide a POST `/auth/login` endpoint that validates user credentials. The endpoint SHALL accept JSON body with `email` and `password` fields and return authentication response.)

#### Scenario: Successful Login Returns JWT Token

- GIVEN a user exists with email "test@test.com" and hashed password
- WHEN the client sends POST `/auth/login` with valid credentials
- THEN the server SHALL return HTTP 200
- AND the response SHALL include a valid JWT token (not a mock string)
- AND the token SHALL be signed with JWT_SECRET

#### Scenario: Login Input Validated with Valibot

- GIVEN the login endpoint
- WHEN the client sends invalid email format
- THEN the server SHALL return HTTP 400 before any authentication attempt

---

### Requirement: Express Server Initialization

The backend MUST load configuration from environment variables before starting. The server SHALL use dotenv to load `.env` file.

(Previously: The backend MUST start an Express server on port 3000. The server SHALL accept incoming HTTP connections and handle routing for API endpoints.)

#### Scenario: Server Loads Environment Variables

- GIVEN a `.env` file exists
- WHEN the backend process starts
- THEN environment variables SHALL be loaded before server initialization
- AND configuration values SHALL come from environment

---

## REMOVED Requirements

### Requirement: Hardcoded Passwords

The system MUST NOT store hardcoded passwords in source code.

(Reason: Security vulnerability - passwords must be hashed and loaded from configuration)

### Requirement: Non-Null Assertions

The system MUST NOT use non-null assertions (`!`) for TypeScript type safety.

(Reason: TypeScript should properly handle nullable types rather than using assertions that bypass type checking)

### Requirement: Mock JWT Token Generation

The system MUST NOT generate mock JWT tokens like `jwt-token-${Date.now()}`.

(Reason: Tokens must be valid JWTs signed with a secret for proper authentication)

---

## Summary

This delta spec adds security enhancements and code quality improvements to the backend:

- **Security**: JWT authentication, password hashing with bcrypt, CORS restriction, environment-based secrets
- **Reliability**: Global error handling, async error wrappers, input validation
- **Maintainability**: Consistent timestamp naming, modular structure, type safety

All scenarios are testable and follow the Given/When/Then format with RFC 2119 keywords for requirement strength.
