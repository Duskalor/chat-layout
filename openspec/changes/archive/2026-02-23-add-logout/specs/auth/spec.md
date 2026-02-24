# Delta for Auth

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
