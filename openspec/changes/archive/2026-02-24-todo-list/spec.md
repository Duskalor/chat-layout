# Todo-List Specification

## Purpose

This specification defines the requirements for adding a personal todo-list feature to the chat application. Users can create, view, mark as completed, and delete their own todo items. The feature integrates with the existing authentication system and state management infrastructure.

## Scope

- Database model for Todo items with user ownership
- REST API endpoints for CRUD operations (GET, POST, PUT, DELETE /todos)
- Frontend UI component for todo management
- Integration with existing Zustand store
- JWT authentication protection for all todo endpoints

## Requirements

### Requirement: Todo Model in Database

The system MUST add a Todo model to the Prisma schema with the following fields:
- `id`: Auto-generated unique identifier (UUID or integer)
- `title`: String, required, non-empty
- `completed`: Boolean, default false
- `userId`: Foreign key to User model
- `createdAt`: DateTime, auto-set on creation
- `updatedAt`: DateTime, auto-set on update

#### Scenario: Todo Model Created with User Relation

- GIVEN the Prisma schema is updated to include a Todo model
- WHEN the migration is applied to the database
- THEN the Todo table SHALL be created with all required fields
- AND the Todo model SHALL have a relation to the User model
- AND each todo MUST be associated with exactly one user

---

### Requirement: GET /todos Endpoint

The system MUST provide a GET /todos endpoint that returns all todos for the authenticated user. The endpoint SHALL be protected by JWT authentication middleware.

#### Scenario: Retrieve User's Todos

- GIVEN a user is authenticated with a valid JWT token
- WHEN the user makes a GET request to /todos
- THEN the system SHALL return all todos belonging to the authenticated user
- AND each todo SHALL include id, title, completed, createdAt, updatedAt
- AND the todos SHALL be ordered by createdAt (newest first)

#### Scenario: Retrieve Todos Without Authentication

- GIVEN a request is made to GET /todos without a valid JWT token
- WHEN the request is received
- THEN the system SHALL return a 401 Unauthorized error
- AND the response SHALL NOT include any todo data

---

### Requirement: POST /todos Endpoint

The system MUST provide a POST /todos endpoint for creating new todos. The endpoint SHALL require authentication and accept a title in the request body.

#### Scenario: Create New Todo

- GIVEN a user is authenticated
- AND the user sends a POST request to /todos with a valid title
- WHEN the request is processed
- THEN a new todo SHALL be created in the database
- AND the todo SHALL be associated with the authenticated user
- AND the response SHALL include the created todo with all fields

#### Scenario: Create Todo with Empty Title

- GIVEN a user is authenticated
- AND the user sends a POST request to /todos with an empty or missing title
- WHEN the request is processed
- THEN the system SHALL return a 400 Bad Request error
- AND no todo SHALL be created

#### Scenario: Create Todo Without Authentication

- GIVEN a request is made to POST /todos without authentication
- WHEN the request is received
- THEN the system SHALL return a 401 Unauthorized error
- AND no todo SHALL be created

---

### Requirement: PUT /todos/:id Endpoint

The system MUST provide a PUT /todos/:id endpoint for updating todo fields. Users SHALL only be able to update their own todos.

#### Scenario: Update Todo Completion Status

- GIVEN a user is authenticated
- AND a todo exists that belongs to the authenticated user
- WHEN the user sends a PUT request to /todos/:id with completed: true
- THEN the todo's completed field SHALL be updated in the database
- AND the response SHALL include the updated todo

#### Scenario: Update Todo Title

- GIVEN a user is authenticated
- AND a todo exists that belongs to the authenticated user
- WHEN the user sends a PUT request to /todos/:id with a new title
- THEN the todo's title SHALL be updated in the database
- AND the response SHALL include the updated todo

#### Scenario: Update Another User's Todo

- GIVEN a user is authenticated
- AND a todo exists that belongs to a different user
- WHEN the user attempts to send a PUT request to /todos/:id
- THEN the system SHALL return a 403 Forbidden error
- AND the todo SHALL NOT be modified

#### Scenario: Update Non-existent Todo

- GIVEN a user is authenticated
- AND no todo exists with the provided id
- WHEN the user sends a PUT request to /todos/:id
- THEN the system SHALL return a 404 Not Found error

---

### Requirement: DELETE /todos/:id Endpoint

The system MUST provide a DELETE /todos/:id endpoint for deleting todos. Users SHALL only be able to delete their own todos.

#### Scenario: Delete Own Todo

- GIVEN a user is authenticated
- AND a todo exists that belongs to the authenticated user
- WHEN the user sends a DELETE request to /todos/:id
- THEN the todo SHALL be removed from the database
- AND the response SHALL indicate successful deletion

#### Scenario: Delete Another User's Todo

- GIVEN a user is authenticated
- AND a todo exists that belongs to a different user
- WHEN the user attempts to send a DELETE request to /todos/:id
- THEN the system SHALL return a 403 Forbidden error
- AND the todo SHALL NOT be deleted

#### Scenario: Delete Non-existent Todo

- GIVEN a user is authenticated
- AND no todo exists with the provided id
- WHEN the user sends a DELETE request to /todos/:id
- THEN the system SHALL return a 404 Not Found error

---

### Requirement: Frontend Todo State Management

The system MUST extend the Zustand store to include todo state. The store SHALL maintain the list of todos for the authenticated user and provide actions for CRUD operations.

#### Scenario: Load Todos into State

- GIVEN a user is authenticated and on a page that displays todos
- WHEN the component mounts
- THEN the system SHALL fetch todos from the GET /todos endpoint
- AND the todos SHALL be stored in the Zustand state

#### Scenario: Add Todo Updates State

- GIVEN a user creates a new todo via the UI
- WHEN the POST request succeeds
- THEN the new todo SHALL be added to the Zustand state
- AND the UI SHALL display the new todo immediately

#### Scenario: Toggle Todo Updates State

- GIVEN a user toggles a todo's completion status
- WHEN the PUT request succeeds
- THEN the todo's completed field SHALL be updated in the Zustand state
- AND the UI SHALL reflect the updated status

#### Scenario: Delete Todo Updates State

- GIVEN a user deletes a todo
- WHEN the DELETE request succeeds
- THEN the todo SHALL be removed from the Zustand state
- AND the UI SHALL no longer display the deleted todo

---

### Requirement: TodoList UI Component

The system MUST provide a TodoList React component that allows users to manage their todos. The component SHALL display all todos and provide controls to add, toggle, and delete todos.

#### Scenario: Display Todo List

- GIVEN the TodoList component is rendered
- AND the user has todos in state
- THEN the component SHALL display all todos as a list
- AND each todo SHALL show its title and completion status
- AND completed todos SHALL have a visual indicator (strikethrough or checkmark)

#### Scenario: Add New Todo

- GIVEN the TodoList component has an input field for new todos
- WHEN the user enters a title and submits
- THEN a new todo SHALL be created via the POST endpoint
- AND the new todo SHALL appear in the list

#### Scenario: Toggle Todo Completion

- GIVEN a todo is displayed with a checkbox or toggle control
- WHEN the user clicks the control
- THEN the todo's completion status SHALL be toggled via the PUT endpoint

#### Scenario: Delete Todo

- GIVEN a todo is displayed with a delete button
- WHEN the user clicks the delete button
- THEN the todo SHALL be deleted via the DELETE endpoint

#### Scenario: Empty Todo List

- GIVEN the user has no todos
- WHEN the TodoList component renders
- THEN the component SHALL display an empty state message
- AND the message SHALL encourage the user to add their first todo

---

### Requirement: Todo API Authentication

All todo API endpoints MUST be protected by JWT authentication. The existing auth middleware SHALL be used to verify user identity.

#### Scenario: Authenticated Request to Todos

- GIVEN a request includes a valid JWT token in the Authorization header
- WHEN the auth middleware validates the token
- THEN the request SHALL proceed to the todo handler
- AND the handler SHALL have access to the authenticated user's ID

#### Scenario: Request with Invalid Token

- GIVEN a request includes an invalid or expired JWT token
- WHEN the auth middleware validates the token
- THEN the system SHALL return a 401 Unauthorized error
- AND the todo handler SHALL NOT be invoked

---

## Summary

This specification establishes the requirements for adding a personal todo-list feature to the chat application. The feature includes:
- Database model for storing user-owned todos
- REST API with full CRUD operations, protected by JWT authentication
- Frontend UI component integrated with Zustand state management
- Proper error handling for authentication and authorization failures
