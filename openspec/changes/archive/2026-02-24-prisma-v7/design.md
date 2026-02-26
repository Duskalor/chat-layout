# Design: Upgrade Prisma to v7

## Technical Approach

This upgrade migrates the backend from Prisma v5.22.0 to v7.x, replacing the Rust-based query engine with the new pure TypeScript implementation. The approach follows a direct dependency upgrade with minimal code changes, leveraging Prisma's backward compatibility. The key changes involve updating the package version, switching the generator provider from `prisma-client-js` to `prisma-client`, and creating a new `prisma.config.ts` for dynamic datasource configuration per Prisma v7 requirements.

## Architecture Decisions

### Decision: Generator Provider Migration

**Choice**: Change `prisma-client-js` to `prisma-client` in schema.prisma
**Alternatives considered**: Continue using legacy `prisma-client-js` (deprecated in v7)
**Rationale**: Prisma v7 no longer supports the Rust-based engine. The new `prisma-client` generator produces a pure TypeScript client with 3x faster query execution and 90% smaller bundle sizes. This aligns with the proposal's goal of improved serverless/edge runtime support.

### Decision: Prisma Client Initialization

**Choice**: Maintain singleton pattern in `src/config/prisma.ts` with new v7 client
**Alternatives considered**: Create new client per request (not recommended for Prisma)
**Rationale**: The existing singleton pattern with `globalThis` is already implemented and works well for connection pooling. Prisma v7 supports this pattern identically to v5. The client initialization options remain compatible.

### Decision: Build Script Update

**Choice**: Add `prisma generate` to build process
**Alternatives considered**: Keep generate as manual step (risky for deployments)
**Rationale**: Ensures the v7 client is always regenerated after dependency updates. Prevents runtime errors from stale client binaries.

## Data Flow

```
pnpm install ──→ Update package.json versions
                    │
                    ▼
npx prisma generate ──→ Read prisma.config.ts
                            │
                            ▼
                    Generate TS client in
                    node_modules/.prisma/client
                            │
                            ▼
pnpm build ──→ tsc compiles TypeScript
                    │
                    ▼
node dist/index.js ──→ connectDatabase() initializes
                      PrismaClient from generated client
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `backend/package.json` | Modify | Update `prisma` and `@prisma/client` from `^5.22.0` to `^7.4.1` |
| `backend/prisma/schema.prisma` | Modify | Change `provider = "prisma-client-js"` to `provider = "prisma-client"` |
| `backend/prisma/prisma.config.ts` | Create | New Prisma v7 config file exporting datasource configuration |
| `backend/package.json` (scripts) | Modify | Add `"postinstall": "prisma generate"` or update build script |
| `backend/src/config/prisma.ts` | No change | Existing code compatible with v7 client |

## Interfaces / Contracts

### prisma.config.ts (New File)

```typescript
import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
} satisfies PrismaConfig;
```

### Modified package.json Scripts

```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "postinstall": "prisma generate"
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Prisma client initialization | Test `connectDatabase()` in isolation with mocked PrismaClient |
| Integration | Database operations | Run existing auth, chat, and todo controller tests against actual DB |
| Manual | Full application startup | Start server, verify DB connection log appears, test login endpoint |

## Migration / Rollout

1. **Phase 1 - Dependencies**: Update `package.json` versions, run `pnpm install`
2. **Phase 2 - Schema**: Update generator provider in `schema.prisma`, create `prisma.config.ts`
3. **Phase 3 - Generate**: Run `npx prisma generate` to produce new TS client
4. **Phase 4 - Build**: Run `pnpm build` to verify TypeScript compilation
5. **Phase 5 - Verify**: Start server, confirm "Database connected successfully" log

Rollback follows the reverse order: revert versions, revert schema, delete config, regenerate client.

## Open Questions

- [ ] Should `postinstall` hook be used instead of modifying build script?
- [ ] Is there a need to test with a fresh database to verify migration compatibility?
