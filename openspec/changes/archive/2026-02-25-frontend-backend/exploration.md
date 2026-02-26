# Exploration: frontend-backend

## Current State

This is a **React 19 frontend-only application** with no backend server code. The project uses:

- **React 19 + TypeScript + Vite + Tailwind CSS v4**
- **Zustand** for state management
- **Socket.io-client** for real-time communication
- **React Router v7** for routing

### Authentication System

- `src/lib/auth-api.ts` contains **mock authentication** with hardcoded users (6 test accounts)
- Login flow uses mock `delay()` to simulate API calls
- Returns mock JWT tokens: `mock-jwt-token-{timestamp}`
- No actual HTTP requests to a backend

### API Communication

| File | Purpose | Current State |
|------|---------|---------------|
| `src/lib/auth-api.ts` | Login/logout | Mock implementation |
| `src/lib/config.ts` | Config | Points to `http://localhost:3000` |
| `src/lib/socket-client.ts` | Socket.io | Connects to localhost:3000 |
| `src/store/user-state.ts` | Auth state | Uses mock auth + socket events |

### Socket Events (Expected)

- `connected` - User connection
- `messages` - Fetch chat messages
- `sendMessage` - Send new message
- `new_message` - Receive new messages

## Affected Areas

- `src/lib/auth-api.ts` — Mock data needs real API integration
- `src/lib/socket-client.ts` — No backend server exists
- `src/store/user-state.ts` — Login/logout uses mock auth
- `src/components/login-form.tsx` — Depends on mock API
- `openspec/specs/auth/spec.md` — References `/auth/login` endpoint

## Approaches

### 1. Create a Node.js/Express Backend
- Pros: Full control, can use same language, Socket.io native support
- Cons: New codebase to maintain, requires separate server setup
- Effort: High

### 2. Use a BaaS (Firebase/Supabase)
- Pros: Fast setup, auth & realtime built-in, less maintenance
- Cons: Vendor lock-in, learning curve, potential costs
- Effort: Medium

### 3. Connect to Existing Backend API
- Pros: Reuse existing infrastructure
- Cons: Requires backend to exist first
- Effort: Medium (if API exists)

## Recommendation

**Start with a minimal Node.js + Express + Socket.io backend** to:
1. Handle `/auth/login`, `/auth/logout` endpoints
2. Manage socket connections for real-time messaging
3. Store users/chats in memory (MVP) or add database later

This keeps the stack consistent (TypeScript full-stack) and leverages the existing socket client already in the frontend.

## Risks

- No backend exists — frontend cannot actually authenticate or message
- Mock data is hardcoded — no persistent storage
- Socket connection will fail (no server at localhost:3000)

## Ready for Proposal

**Yes.** The exploration clarifies that "frontend-backend" means creating a backend server to replace the mock authentication and enable real-time chat functionality. A proposal should specify:
- Backend tech stack (recommend: Node.js + Express + Socket.io)
- API endpoints needed (login, logout, getChats, etc.)
- Socket events to implement
- Whether to use in-memory storage or add a database
