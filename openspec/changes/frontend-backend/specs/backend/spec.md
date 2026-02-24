# Backend API Specification

## Purpose

This specification defines the backend API contract required for the chat application. The backend provides REST endpoints for authentication and Socket.io events for real-time messaging.

## Requirements

### Requirement: Express Server Initialization

The backend MUST start an Express server on port 3000. The server SHALL accept incoming HTTP connections and handle routing for API endpoints.

#### Scenario: Server Starts Successfully

- GIVEN the backend process is started
- WHEN the server initializes
- THEN the server SHALL listen on port 3000
- AND log a message indicating it is running

### Requirement: CORS Configuration

The backend MUST configure CORS to allow requests from the frontend. The server SHALL accept requests from any origin (`*`) and support GET and POST methods.

#### Scenario: CORS Allows Frontend Requests

- GIVEN the backend server is running
- WHEN the frontend makes a cross-origin request
- THEN the server SHALL include CORS headers in the response
- AND allow the request to proceed

### Requirement: Authentication Login Endpoint

The backend MUST provide a POST `/auth/login` endpoint that validates user credentials. The endpoint SHALL accept JSON body with `email` and `password` fields and return authentication response.

#### Scenario: Successful Login with Valid Credentials

- GIVEN a user exists in the system with email "test@test.com" and password "password123"
- WHEN the client sends a POST request to `/auth/login` with {email: "test@test.com", password: "password123"}
- THEN the server SHALL return HTTP 200
- AND the response SHALL include success: true
- AND the response SHALL include a user object without password
- AND the response SHALL include a token string
- AND the response SHALL include an array of chats for the user

#### Scenario: Failed Login with Invalid Credentials

- GIVEN no user exists with the provided credentials
- WHEN the client sends a POST request to `/auth/login` with invalid email/password
- THEN the server SHALL return HTTP 401
- AND the response SHALL include success: false
- AND the response SHALL include an error message "Invalid email or password"

#### Scenario: Login Request Missing Credentials

- GIVEN the client sends a POST request to `/auth/login` with empty body
- WHEN the server processes the request
- THEN the server SHALL return HTTP 401 (due to no matching user)
- AND the response SHALL indicate authentication failure

### Requirement: Authentication Logout Endpoint

The backend MUST provide a POST `/auth/logout` endpoint that handles session termination. The endpoint SHALL return a success response.

#### Scenario: Successful Logout

- GIVEN an authenticated user
- WHEN the client sends a POST request to `/auth/logout`
- THEN the server SHALL return HTTP 200
- AND the response SHALL include success: true

### Requirement: Socket.io Connection Handling

The backend MUST establish Socket.io connections with clients. The server SHALL handle client connections, disconnections, and message events.

#### Scenario: Client Connects to Socket.io

- GIVEN the backend server is running
- WHEN a client connects via Socket.io
- THEN the server SHALL log the client connection
- AND the server SHALL emit the 'messages' event with chat data

#### Scenario: Client Sends 'connected' Event

- GIVEN a client has established a Socket.io connection
- WHEN the client emits 'connected' event with userId
- THEN the server SHALL log the user connection
- AND the server SHALL emit 'messages' event with the user's chats

#### Scenario: Client Sends Message

- GIVEN a client has an active Socket.io connection
- WHEN the client emits 'sendMessage' event with a message object
- THEN the server SHALL log the received message
- AND the server SHALL emit 'new_message' event to all connected clients

#### Scenario: Client Disconnects

- GIVEN a client has an active Socket.io connection
- WHEN the client disconnects
- THEN the server SHALL log the disconnection
- AND clean up any client-specific resources

### Requirement: In-Memory User Storage

The backend MUST store user data in memory. The system SHALL maintain a list of predefined test users.

#### Scenario: User Data Available

- GIVEN the backend is running
- WHEN a login request is made
- THEN the server SHALL check credentials against in-memory user store
- AND support at least 6 test users with different credentials

### Requirement: Chat Data Generation

The backend MUST generate chat data for authenticated users. The system SHALL create mock chats for each user containing participant information and last message metadata.

#### Scenario: Chat Data Returned on Login

- GIVEN a user successfully logs in
- WHEN the server generates the response
- THEN the response SHALL include an array of chats
- AND each chat SHALL contain id, name, isGroup, participants, and lastMessage fields

### Requirement: JSON Body Parsing

The backend MUST parse JSON request bodies. The server SHALL use express.json() middleware to handle JSON payloads.

#### Scenario: JSON Request Body Parsed

- GIVEN the backend server is running
- WHEN a client sends a POST request with JSON body
- THEN the server SHALL parse the JSON content
- AND make the data available in req.body
