# Frontend Styling Specification

## Purpose

This specification defines the visual styling requirements for the chat application. It ensures a consistent, modern, and polished user interface by establishing design tokens, component styling standards, and visual hierarchy across all UI elements.

## Requirements

### Requirement: Design Tokens in index.css

The system MUST define a comprehensive set of design tokens in `src/index.css` using Tailwind CSS v4 `@theme` directive. The design tokens SHALL include:

- **Colors**: Primary, secondary, surface, border, text colors with semantic naming
- **Shadows**: Small, medium, and large shadow values for visual depth
- **Border-radius**: Consistent radius values (sm, md, lg, full)
- **Spacing**: Consistent padding and margin values

#### Scenario: Design tokens are defined in index.css

- GIVEN a Tailwind CSS v4 project
- WHEN the developer defines design tokens in `src/index.css` using `@theme` directive
- THEN the tokens MUST be available as utility classes (e.g., `bg-primary`, `shadow-md`, `rounded-lg`)
- AND the tokens MUST be used consistently across all components

#### Scenario: Existing design tokens are used

- GIVEN components that need styling
- WHEN a developer applies background color
- THEN the developer SHOULD use existing tokens (e.g., `--color-primary`, `--color-surface`)
- AND SHOULD NOT use hardcoded color values

#### Scenario: New design tokens are needed

- GIVEN a component that requires a color not in the design tokens
- WHEN adding a new token is necessary
- THEN the token SHOULD be added to `src/index.css` following the existing naming convention
- AND the token SHOULD be semantic (e.g., `--color-success`, `--color-error`)

---

### Requirement: Sidebar Styling

The system MUST have a sidebar with improved chat list items, search input, and avatars. The sidebar SHALL use design tokens for all styling properties.

#### Scenario: Sidebar displays chat list

- GIVEN a user is logged in and has access to the chat application
- WHEN the sidebar renders
- THEN it MUST display a list of chat items with avatar, name, and last message preview
- AND each chat item MUST have a hover state with subtle background color change
- AND the active chat item MUST have a distinct background color from the design tokens

#### Scenario: Sidebar search input is functional

- GIVEN the sidebar search input is visible
- WHEN a user types in the search input
- THEN the chat list MUST filter in real-time to show matching chats
- AND the search input MUST have proper focus states using design tokens

#### Scenario: Sidebar avatars display correctly

- GIVEN a chat item with an avatar placeholder
- WHEN the avatar is rendered
- THEN it MUST display the first letter of the contact name in uppercase
- AND the avatar MUST use primary color from design tokens
- AND the avatar SHOULD be circular (`rounded-full`)

---

### Requirement: Chat Header Styling

The system MUST have a chat header with refined avatar, status indicator, and typography. The header SHALL provide clear visual hierarchy.

#### Scenario: Chat header displays contact information

- GIVEN a user has opened a chat
- WHEN the chat header renders
- THEN it MUST display the contact's avatar, name, and online status
- AND the avatar MUST be circular with consistent sizing (40x40px)
- AND the name MUST use primary text color from design tokens with semibold weight
- AND the status indicator MUST use secondary text color

#### Scenario: Chat header has consistent styling

- GIVEN the chat header component
- WHEN it is rendered
- THEN it MUST use surface background color from design tokens
- AND it MUST have subtle shadow for visual separation
- AND it MUST have consistent padding using design tokens

---

### Requirement: Message Bubbles - Outgoing Messages

The system MUST render outgoing messages (userChat component) with enhanced visual design. The message bubbles SHALL use design tokens for all styling.

#### Scenario: Outgoing message bubble displays correctly

- GIVEN a user sends a message
- WHEN the message is rendered as outgoing
- THEN it MUST display on the right side of the message area
- AND the bubble MUST use primary color background
- AND the text MUST use inverse text color from design tokens
- AND the bubble MUST have appropriate border-radius (larger on sending side)

#### Scenario: Outgoing message has proper spacing

- GIVEN an outgoing message is rendered
- WHEN it appears in the message list
- THEN it MUST have consistent margin from other messages
- AND the timestamp MUST be displayed below the bubble
- AND the timestamp SHOULD use secondary text color

---

### Requirement: Message Bubbles - Incoming Messages

The system MUST render incoming messages (anotherChat component) with enhanced visual design. The message bubbles SHALL use design tokens for all styling.

#### Scenario: Incoming message bubble displays correctly

- GIVEN another user sends a message
- WHEN the message is rendered as incoming
- THEN it MUST display on the left side of the message area
- AND the bubble MUST use surface color background
- AND the bubble MUST have subtle shadow for depth
- AND the bubble MUST have appropriate border-radius (larger on receiving side)

#### Scenario: Incoming group message shows sender name

- GIVEN a message in a group chat is received
- WHEN the message is rendered
- THEN it MUST display the sender's name above the message bubble
- AND the sender name SHOULD use a distinct color from the message text

#### Scenario: Incoming message has proper spacing

- GIVEN an incoming message is rendered
- WHEN it appears in the message list
- THEN it MUST have consistent margin from other messages
- AND the timestamp MUST be displayed below the bubble
- AND for group chats, the avatar MUST be displayed next to the message

---

### Requirement: Input Component

The system MUST have a polished input component with improved send button and input field. The input SHALL use design tokens for all styling.

#### Scenario: Input field has proper design

- GIVEN the input component is visible
- WHEN a user sees the input field
- THEN it MUST have a subtle border using border color from design tokens
- AND it MUST have rounded corners using radius-md token
- AND it MUST have focus states with ring using primary color
- AND the placeholder text MUST use secondary text color

#### Scenario: Send button is properly styled

- GIVEN the input component has a send button
- WHEN the button is rendered
- THEN it MUST use primary color background
- AND it MUST have a hover state using primary-hover color
- AND it MUST be circular or rounded
- AND it MUST have an icon indicating send action

#### Scenario: Input component has consistent container

- GIVEN the input component container
- WHEN it is rendered
- THEN it MUST use surface background color
- AND it MUST have subtle shadow for visual separation
- AND it MUST have consistent padding using design tokens

---

### Requirement: Consistent Spacing and Typography

The system MUST apply consistent spacing and typography throughout all components. The design tokens SHALL define spacing values.

#### Scenario: Components use consistent spacing

- GIVEN multiple components in the application
- WHEN they are rendered
- THEN they SHOULD use spacing values from design tokens
- AND padding SHOULD use consistent values (e.g., p-4, p-3)
- AND margins between components SHOULD be consistent

#### Scenario: Typography is consistent

- GIVEN text elements throughout the application
- WHEN text is rendered
- THEN it SHOULD use defined text color tokens (text-primary, text-secondary)
- AND font weights SHOULD be consistent (normal for body, semibold for headings)
- AND font sizes SHOULD follow a consistent scale

---

## ADDED Requirements

### Requirement: Enhanced Design Token Palette

The system SHALL expand the design token palette in `src/index.css` to include additional semantic colors for common UI states.

#### Scenario: New semantic colors are added

- GIVEN the design system needs additional colors
- WHEN new semantic tokens are added to `src/index.css`
- THEN tokens SHOULD include colors for success, warning, error states
- AND these tokens SHOULD be available as utilities

### Requirement: Visual Depth with Shadows

The system SHALL use shadows consistently to create visual hierarchy and depth.

#### Scenario: Components use appropriate shadow levels

- GIVEN components at different elevation levels
- WHEN rendered
- THEN interactive elements (buttons, inputs) SHOULD use shadow-sm
- THEN elevated containers (cards, headers) SHOULD use shadow-md
- AND shadows SHOULD NOT be applied to inline elements

---

## MODIFIED Requirements

### Requirement: Consistent Color Usage

The system MUST use the defined design tokens for all colors instead of hardcoded values. Components SHOULD reference token variables rather than specific color values.

(Previously: Components used inconsistent hardcoded Tailwind colors)

#### Scenario: Components reference design tokens

- GIVEN a component needs a background color
- WHEN applying the background
- THEN the component MUST use token-based utility classes
- AND the component SHOULD NOT use arbitrary values like `bg-[#e0e0db]`

---

## Summary

This specification establishes the foundation for consistent styling across the chat application. By defining design tokens and component styling requirements, the application will have a cohesive, professional appearance with proper visual hierarchy and spacing.
