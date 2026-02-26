# Delta for Auth

## MODIFIED Requirements

### Requirement: User Authentication

The system SHALL validate user credentials against the database. The authentication service MUST query the database to verify email and password.

(Previously: User credentials were validated against in-memory mock data)

#### Scenario: Login with Valid Database Credentials

- GIVEN a user exists in the database with email "john@example.com" and password "password123"
- WHEN the user submits login credentials to `/auth/login`
- THEN the system SHALL query the database for a user with the provided email
- AND the system SHALL validate the password using bcrypt comparison
- AND the system SHALL return a valid JWT token
- AND the user SHALL be authenticated successfully

#### Scenario: Login with Invalid Email

- GIVEN no user exists in the database with email "wrong@example.com"
- WHEN the user submits login credentials to `/auth/login`
- THEN the system SHALL query the database
- AND the system SHALL return an UnauthorizedError with message "Invalid credentials"
- AND the user SHALL NOT be authenticated

#### Scenario: Login with Wrong Password

- GIVEN a user exists in the database with email "john@example.com"
- WHEN the user submits login credentials with an incorrect password
- THEN the system SHALL query the database for the user
- AND the system SHALL fail the bcrypt password comparison
- AND the system SHALL return an UnauthorizedError with message "Invalid credentials"
- AND the user SHALL NOT be authenticated

## ADDED Requirements

### Requirement: Database Connection

The system MUST establish a connection to the PostgreSQL database on backend startup. The backend SHALL fail to start if the database connection cannot be established.

#### Scenario: Backend Starts with Valid Database

- GIVEN the DATABASE_URL environment variable is set correctly
- AND the PostgreSQL database is running and accessible
- WHEN the backend server starts
- THEN the system SHALL call connectDatabase()
- AND the connection to PostgreSQL SHALL be established
- AND the backend SHALL accept requests

#### Scenario: Backend Starts without Database URL

- GIVEN the DATABASE_URL environment variable is not set
- WHEN the backend server starts
- THEN the system SHALL throw a configuration error
- AND the backend SHALL NOT start
- AND the error message SHALL indicate DATABASE_URL is missing
