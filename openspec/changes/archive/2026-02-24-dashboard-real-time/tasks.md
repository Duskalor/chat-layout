# Tasks: Real-Time Dashboard

## Phase 1: Backend - Foundation & Types

- [x] 1.1 Create `backend/src/types/dashboard.ts` with `DashboardStats` and `PresenceUpdate` interfaces
- [x] 1.2 Create `backend/src/services/stats.service.ts` with methods to aggregate chat and todo metrics from Prisma

## Phase 2: Backend - Socket Integration

- [x] 2.1 Add presence tracking: Create a `Map<string, Set<string>>` in `backend/src/index.ts` to track userId → socketIds
- [x] 2.2 Add socket connection handler: Register userId on connect, emit `dashboard:presence` event
- [x] 2.3 Add socket disconnection handler: Remove socketId on disconnect, emit `dashboard:presence` event
- [x] 2.4 Add stats interval: Create a `setInterval` every 10 seconds to query stats.service.ts and emit `dashboard:stats` event

## Phase 3: Frontend - State Management

- [x] 3.1 Modify `frontend/src/store/user-state.ts`: Add `onlineUsers: string[]` and `setOnlineUsers` action to UserState interface

## Phase 4: Frontend - Socket Client Updates

- [x] 4.1 Modify `frontend/src/lib/socket-client.ts`: Add listener for `dashboard:presence` event that calls `setOnlineUsers`
- [x] 4.2 Modify `frontend/src/lib/socket-client.ts`: Add listener for `dashboard:stats` event

## Phase 5: Frontend - Components & Routes

- [x] 5.1 Create `frontend/src/components/Dashboard.tsx` with metrics display: online users count, total messages, active chats, total/completed/pending todos
- [x] 5.2 Modify `frontend/src/route/routes.tsx`: Add `/dashboard` route under ProtectedRoute

## Phase 6: Verification

- [ ] 6.1 Run `pnpm lint` to ensure no linting errors
- [ ] 6.2 Run `pnpm build` to verify type-checking passes
- [ ] 6.3 Manual test: Login, navigate to /dashboard, verify all metrics display correctly
- [ ] 6.4 Manual test: Open multiple clients, verify presence updates in real-time

## Implementation Notes

- Stats interval should use cached stats object to avoid recalculating on every emission
- Presence tracking uses Map<userId, Set<socketId>> to support multi-device scenarios
- Socket events prefixed with `dashboard:` to avoid collision with existing chat events
- Todo stats include: totalTodos, completedTodos, pendingTodos from Prisma queries
