# Auth

## ADDED Requirements

### Requirement: User Session Logout

The system MUST provide a mechanism for authenticated users to terminate their session. When a user initiates logout, the system SHALL clear all user-related state and redirect to the user selection screen.

#### Scenario: Successful Logout Flow

- GIVEN a user is currently logged in (user state contains a valid User object)
- AND the user is viewing the chat interface via the sidebar
- WHEN the user clicks the logout button labeled "Cerrar"
- THEN the system SHALL set the user state to `null`
- AND the system SHALL clear all persisted user data from localStorage
- AND the system SHALL disconnect the active socket connection
- AND the system SHALL navigate the user to the `/users` route

#### Scenario: Logout During Active Chat Session

- GIVEN a user is logged in
- AND has an active chat conversation open
- WHEN the user clicks the logout button
- THEN the system SHALL clear the user state
- AND the system SHALL clear any chat data stored in state
- AND the socket SHALL be disconnected
- AND the user SHALL be redirected to `/users`
- AND when a new user logs in, they SHALL see fresh empty state

#### Scenario: Logout Button Presence

- GIVEN a user is logged in (user state is not null)
- WHEN the sidebar component renders
- THEN the logout button SHALL be visible in the sidebar footer
- AND clicking the button SHALL trigger the logout handler

### Requirement: Session State Persistence

The system MUST ensure that user session data does not persist across logout operations. All authentication state MUST be removed from localStorage upon logout.

#### Scenario: State Cleared from Storage

- GIVEN a user was previously logged in and then logged out
- WHEN another user visits the application
- THEN the application SHALL NOT restore the previous user's session
- AND the new user SHALL see the user selection screen at `/users`

### Requirement: Socket Connection Management

The system SHOULD disconnect the socket connection when a user logs out to prevent orphaned connections.

#### Scenario: Socket Disconnection on Logout

- GIVEN a user is logged in with an active socket connection
- WHEN the user initiates logout
- THEN the system SHOULD disconnect the socket
- AND the socket SHALL be available for reconnection when a new user logs in

## MODIFIED Requirements

### Requirement: User Selection Flow

The user selection flow SHALL now support both initial login and post-logout re-selection.

(Previously: Users could select a profile to log in, but had no way to log out and select a different profile)

#### Scenario: Selecting User After Logout

- GIVEN a user has logged out and is at the `/users` route
- WHEN the user clicks on a user profile card
- THEN the system SHALL set the selected user in state
- AND navigate to the chat interface at `/`
- AND the socket connection SHALL be established for the new user

## ADDED Requirements (Login)

### Requirement: Login Form Display

The login form MUST be displayed when an unauthenticated user accesses the application. The login form SHALL consist of email input field, password input field, and submit button. The form SHALL be the default view when no valid session exists.

#### Scenario: Display Login Form on Initial Load

- GIVEN no valid authentication session exists
- WHEN the user loads the application
- THEN the login form with email and password fields SHALL be displayed

#### Scenario: Display Login Form After Logout

- GIVEN a valid authentication session exists
- WHEN the user clicks the logout button
- AND the session is cleared
- THEN the login form SHALL be displayed

### Requirement: Credential Validation

The system MUST validate user credentials against the backend authentication endpoint. The system SHALL send a POST request to `/auth/login` with email and password. The system SHALL handle both successful and failed authentication responses.

#### Scenario: Successful Login with Valid Credentials

- GIVEN the user has entered a valid email and password
- WHEN the user submits the login form
- THEN the system SHALL send credentials to `/auth/login`
- AND on successful response, the system SHALL store the authentication token
- AND the system SHALL navigate to the chat interface

#### Scenario: Failed Login with Invalid Credentials

- GIVEN the user has entered an invalid email or password
- WHEN the user submits the login form
- THEN the system SHALL send credentials to `/auth/login`
- AND on failure response, the system SHALL display an error message
- AND the login form SHALL remain visible

#### Scenario: Login Form Validation

- GIVEN the user has left the email field empty
- WHEN the user attempts to submit the login form
- THEN the system SHALL display a validation error for the email field

- GIVEN the user has left the password field empty
- WHEN the user attempts to submit the login form
- THEN the system SHALL display a validation error for the password field

### Requirement: Session Management

The system SHALL maintain the authentication session across page refreshes. The authentication token MUST be stored securely. The system SHALL include the authentication token in subsequent API and socket requests.

#### Scenario: Session Persists After Page Refresh

- GIVEN a valid authentication token is stored
- WHEN the user refreshes the page
- THEN the system SHALL validate the stored token
- AND if valid, the user SHALL remain authenticated
- AND the user SHALL be navigated to the chat interface

#### Scenario: Include Token in Socket Connection

- GIVEN a valid authentication token exists
- WHEN the socket client connects
- THEN the system SHALL include the authentication token in the connection
- AND the server SHALL validate the token for socket communication

### Requirement: Protected Routes

The system SHALL restrict access to protected routes for authenticated users only. Unauthenticated access to protected routes MUST redirect to the login form. Protected routes SHALL include the main chat interface.

#### Scenario: Access Protected Route Without Authentication

- GIVEN no valid authentication session exists
- WHEN the user attempts to access a protected route directly
- THEN the system SHALL redirect to the login form
- AND the protected content SHALL NOT be displayed

#### Scenario: Access Protected Route With Authentication

- GIVEN a valid authentication session exists
- WHEN the user attempts to access a protected route
- THEN the user SHALL be granted access
- AND the protected content SHALL be displayed

### Requirement: Logout Functionality

The system MUST provide logout functionality that clears the authentication session. The logout action SHALL clear stored tokens and redirect to the login form.

#### Scenario: User Logs Out

- GIVEN an authenticated user is viewing the chat interface
- WHEN the user clicks the logout button
- THEN the system SHALL clear the stored authentication token
- AND the system SHALL navigate to the login form
- AND the socket connection SHALL be disconnected

#### Scenario: Socket Disconnects After Logout

- GIVEN an authenticated user has an active socket connection
- WHEN the user logs out
- THEN the socket connection SHALL be closed
- AND no further socket events SHALL be sent

### Requirement: Error Handling

The system SHALL handle network errors and server errors gracefully. The system SHALL display appropriate error messages to the user for various failure scenarios.

#### Scenario: Network Error During Login

- GIVEN the user has submitted the login form
- WHEN a network error occurs preventing the request
- THEN the system SHALL display a generic error message
- AND the login form SHALL remain available for retry

#### Scenario: Server Error During Login

- GIVEN the user has submitted the login form
- WHEN the server returns a 500 error
- THEN the system SHALL display a service unavailable message
- AND the login form SHALL remain available for retry

#### Scenario: Token Validation Failure

- GIVEN a stored token exists but is invalid or expired
- WHEN the application loads or validates the session
- THEN the system SHALL clear the invalid token
- AND the system SHALL display the login form
