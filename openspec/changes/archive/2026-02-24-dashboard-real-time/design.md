# Design: Real-Time Dashboard

## Technical Approach

This change extends the existing Socket.io infrastructure to provide real-time dashboard capabilities. The backend will track connected users and periodically emit statistics, while the frontend will create a dashboard component that subscribes to these real-time events. We leverage the existing auth middleware for user identification and Prisma for statistics aggregation.

## Architecture Decisions

### Decision: Presence Tracking Strategy

**Choice**: Use a Map<string, Set<string>> to track userId -> socketIds (supporting multi-device)
**Alternatives considered**: 
- Simple Set of userIds (rejected: doesn't support multiple connections per user)
- Redis-based tracking (rejected: adds external dependency; in-memory sufficient for single-server)

**Rationale**: Follows existing in-memory patterns in the codebase. Using Set allows tracking multiple socket connections per user (e.g., same user on mobile and desktop).

### Decision: Statistics Emission Frequency

**Choice**: Emit stats updates every 10 seconds via setInterval
**Alternatives considered**:
- Per-event emission (rejected: too frequent DB queries)
- On-demand REST endpoint (rejected: doesn't meet real-time requirement)

**Rationale**: Balances freshness (10s is acceptable for dashboard metrics) with performance. Caches the stats object to avoid recalculating on every emission.

### Decision: Socket Event Naming

**Choice**: Prefix dashboard events with `dashboard:` (e.g., `dashboard:presence`, `dashboard:stats`)
**Alternatives considered**:
- Generic names like `presence`, `stats` (rejected: potential collision with other features)
- Namespaced approach using Socket.io namespaces (rejected: overkill for this feature)

**Rationale**: Clear namespace that won't conflict with existing chat events. Matches existing convention of using descriptive event names.

### Decision: Todo Statistics Integration

**Choice**: Include todo metrics (total, completed, pending) in dashboard stats, aggregated globally
**Alternatives considered**:
- Per-user todo stats (rejected: adds complexity; dashboard shows global metrics)
- Only include counts without breakdown (rejected: less actionable)

**Rationale**: Aligns with dashboard's global metrics approach. Completed/pending breakdown provides useful context about overall productivity.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                 │
│  ┌─────────────────┐    ┌──────────────────┐                   │
│  │ Presence Tracker│    │ Stats Service    │                   │
│  │ (Map<userId,    │    │ (prisma queries) │                   │
│  │  Set<socketId>) │    └────────┬─────────┘                   │
│  └────────┬────────┘             │                              │
│           │                      │                              │
│           └──────────┬───────────┘                              │
│                      │                                          │
│              ┌───────▼───────┐                                  │
│              │  Socket.io    │                                  │
│              │  (io.emit)    │                                  │
│              └───────┬───────┘                                  │
└──────────────────────┼──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌───────────┐  ┌─────────────┐  ┌──────────────┐
│ Dashboard │  │ Chat        │  │ Other        │
│ Component │  │ Component   │  │ Components   │
│           │  │ (existing)  │  │              │
└───────────┘  └─────────────┘  └──────────────┘

Socket Events:
- Client → Server: "dashboard:subscribe" (optional, auto-on-connect)
- Server → Client: "dashboard:presence" { onlineUsers: string[] }
- Server → Client: "dashboard:stats" { totalMessages, activeChats, onlineUsers, totalTodos, completedTodos, pendingTodos }
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/src/services/stats.service.ts` | Create | Service for aggregating chat stats and todo metrics from Prisma |
| `backend/src/index.ts` | Modify | Add presence tracking, stats interval, new socket events |
| `frontend/src/components/Dashboard.tsx` | Create | Dashboard component displaying metrics including todo counts |
| `frontend/src/route/routes.tsx` | Modify | Add `/dashboard` route under ProtectedRoute |
| `frontend/src/lib/socket-client.ts` | Modify | Add listeners for dashboard:presence and dashboard:stats events |
| `frontend/src/store/user-state.ts` | Modify | Add onlineUsers array and setOnlineUsers action |

## Interfaces / Contracts

### Backend Types (backend/src/types/dashboard.ts)

```typescript
export interface DashboardStats {
  totalMessages: number;
  activeChats: number;
  onlineUsers: number;
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export interface PresenceUpdate {
  onlineUsers: string[];
}
```

### Socket Events

```typescript
// Server emits
'dashboard:presence': { onlineUsers: string[] }
'dashboard:stats': { totalMessages: number; activeChats: number; onlineUsers: number; totalTodos: number; completedTodos: number; pendingTodos: number }

// Client listens (handled in socket-client.ts)
```

### Frontend State Extension (frontend/src/store/user-state.ts)

```typescript
interface UserState {
  // ... existing fields
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | stats.service.ts functions (chat + todo metrics) | Test Prisma query mocking |
| Unit | Presence tracking logic | Test add/remove user operations |
| Integration | Socket event flow (including todo stats) | Manual testing with multiple clients |
| E2E | Dashboard page loads | Verify all metrics display correctly |

## Migration / Rollout

No migration required. This feature adds new functionality without modifying existing data or schemas.

Rollback plan (if issues arise):
1. Remove `/dashboard` route from `routes.tsx`
2. Delete `Dashboard.tsx` component
3. Revert socket changes in `backend/src/index.ts` to previous state
4. Remove `stats.service.ts` file

## Open Questions

- [ ] Should the dashboard be admin-only? (Current proposal uses existing auth, no admin role check)
- [ ] Should stats include per-user breakdown or just totals? (Currently totals only)
- [ ] Should we cache stats at the database level (Redis) for multi-server deployments?
