# Proposal: Real-Time Dashboard

## Intent

This change addresses the need for administrators and users to monitor chat application activity in real-time. Currently, there is no way to see who is online, message counts, or live activity updates. The real-time dashboard will provide visibility into user presence, chat statistics, and live updates using the existing WebSocket infrastructure.

## Scope

### In Scope

- User presence/activity indicators showing online/offline status
- Chat statistics dashboard (total messages, active chats, online users count)
- Live updates via WebSocket for real-time data refresh
- Dashboard UI component with key metrics display
- Backend endpoints for aggregating statistics
- Socket events for pushing live updates to dashboard clients

### Out of Scope

- Historical analytics/charts (future enhancement)
- User behavior tracking beyond presence
- Notification system for dashboard events
- Admin-only access controls (will use existing auth)

## Approach

The dashboard will leverage the existing Socket.io infrastructure currently used for chat messaging. We will extend the backend to:

1. Track connected users in a Map/set with userId
2. Emit presence updates when users connect/disconnect
3. Create a statistics aggregation service that queries Prisma for message counts, active chats, etc.
4. Emit periodic stats updates via Socket.io

Frontend approach:

1. Create a Dashboard component displaying key metrics
2. Subscribe to socket events for presence and stats updates
3. Use existing Zustand store for user state
4. Add a route for the dashboard page

## Affected Areas

| Area                                    | Impact   | Description                                                      |
| --------------------------------------- | -------- | ---------------------------------------------------------------- |
| `backend/src/index.ts`                  | Modified | Add user presence tracking, stats aggregation, new socket events |
| `backend/src/services/stats.service.ts` | New      | Service for aggregating chat statistics from database            |
| `frontend/src/components/Dashboard.tsx` | New      | Dashboard component with metrics display                         |
| `frontend/src/route/routes.tsx`         | Modified | Add dashboard route                                              |
| `frontend/src/lib/socket-client.ts`     | Modified | Add socket listeners for presence/stats events                   |
| `frontend/src/store/user-state.ts`      | Modified | Add online users state                                           |

## Risks

| Risk                                           | Likelihood | Mitigation                                                        |
| ---------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| Performance impact from frequent stats queries | Medium     | Cache stats, emit updates every 5-10 seconds instead of per-event |
| Memory leak from tracking connected users      | Low        | Use WeakMap or clean up on disconnect properly                    |
| Stale presence data on unexpected disconnect   | Medium     | Implement heartbeat/ping mechanism                                |

## Rollback Plan

1. Remove dashboard route from `routes.tsx`
2. Remove Dashboard component from `components/`
3. Revert socket changes in `backend/src/index.ts` to previous state
4. Remove stats service file
5. Redeploy - no database changes required

## Dependencies

- Socket.io infrastructure (already exists)
- Prisma database (already exists)
- Zustand state management (already exists)
- Existing authentication system

## Success Criteria

- [ ] Dashboard shows count of online users in real-time
- [ ] Dashboard shows total message count
- [ ] Dashboard shows number of active chats
- [ ] Presence indicators update when users connect/disconnect
- [ ] All stats refresh automatically via WebSocket
- [ ] Linting passes (`pnpm lint`)
- [ ] Type-checking passes (`pnpm build`)
