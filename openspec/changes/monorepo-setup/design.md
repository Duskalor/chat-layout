# Design: Monorepo Setup

## Technical Approach

Convert the project to a pnpm monorepo by creating a root workspace configuration. The approach uses pnpm's native workspace support (`pnpm-workspace.yaml`) to declare `frontend/` and `backend/` as workspace members. Root-level scripts will use `pnpm -r` (recursive) with `--parallel` flag to run all workspace dev scripts concurrently, achieving the single `pnpm dev` command goal.

## Architecture Decisions

### Decision: Use pnpm-workspace.yaml over package.json workspaces array

**Choice**: Create `pnpm-workspace.yaml` to declare workspace members
**Alternatives considered**: Using `"workspaces"` array in root package.json
**Rationale**: pnpm-workspace.yaml is the recommended approach for pnpm monorepos. It provides better control over workspace structure and is more explicit. The `workspaces` array in package.json is primarily for npm/Yarn compatibility.

### Decision: Use pnpm -r --parallel for concurrent dev execution

**Choice**: Root `"dev": "pnpm -r --parallel dev"`
**Alternatives considered**: Using `concurrently` package, using `pnpm -r --parallel run dev`, using individual workspace references
**Rationale**: `--parallel` flag is pnpm's native way to run scripts in all workspaces simultaneously. It's simpler than adding an external package and works out-of-the-box with pnpm. The `-r` flag ensures it runs recursively through all workspaces.

### Decision: Keep existing package.json scripts unchanged

**Choice**: No modifications to frontend/package.json or backend/package.json scripts
**Alternatives considered**: Updating scripts to use workspace-specific prefixes
**Rationale**: The existing scripts (`"dev": "vite"` and `"dev": "tsx watch src/index.ts"`) work correctly with `pnpm -r`. No changes needed ensures backward compatibility and reduces risk.

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  pnpm dev (root)                                        │
└───────────────────────┬─────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│  frontend/             │   │  backend/             │
│  pnpm dev              │   │  pnpm dev             │
│       │                │   │       │              │
│       ▼                │   │       ▼              │
│  Vite dev server       │   │  tsx watch server    │
│  http://localhost:5173 │   │  http://localhost:3000│
└───────────────────────┘   └───────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `pnpm-workspace.yaml` | Create | Declare frontend/ and backend/ as workspace packages |
| `package.json` | Create | Root package.json with workspace scripts (dev, build, lint) |
| `pnpm-lock.yaml` | Regenerate | Generated after running `pnpm install` at root |

## Interfaces / Contracts

### pnpm-workspace.yaml
```yaml
packages:
  - 'frontend'
  - 'backend'
```

### Root package.json
```json
{
  "name": "chat-layout",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Integration | Single command starts both services | Run `pnpm dev` and verify both ports respond |
| Integration | Dependency hoisting | Verify shared deps in root node_modules |
| Integration | Independent workspace execution | Run `cd frontend && pnpm dev` and `cd backend && pnpm dev` separately |

## Migration / Rollout

1. **Pre-migration**: Backup/remove existing `node_modules` in frontend/ and backend/ if they exist
2. **Migration steps**:
   - Create `pnpm-workspace.yaml` at root
   - Create root `package.json` with scripts
   - Run `pnpm install` at root to generate lockfile
3. **Verification**: Run `pnpm dev` to confirm both services start
4. **Post-migration**: Developers can remove individual node_modules folders

No data migration required - this is purely a build/tooling change.

## Open Questions

- [ ] Should we add a root TypeScript config for cross-workspace type checking?
- [ ] Should we add any shared dev dependencies at root (e.g., typescript)?
