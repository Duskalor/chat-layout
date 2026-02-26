# Proposal: Monorepo Setup

## Intent

Convert the project from a loosely-connected frontend/backend structure to a proper pnpm monorepo. Currently, developers must run two separate terminal commands to start both services. The goal is a single `pnpm dev` command from the root that starts both frontend and backend concurrently.

## Scope

### In Scope
- Create root `package.json` with pnpm workspaces configuration
- Create root `pnpm-workspace.yaml` to define workspace members (frontend/, backend/)
- Add root scripts: `dev`, `build`, `lint` that operate on all workspaces
- Configure concurrent execution of frontend and backend dev servers
- Ensure existing package.json scripts in frontend/ and backend/ remain functional

### Out of Scope
- Database changes or migrations
- Code sharing between frontend/backend (shared types/utilities)
- Docker containerization
- Production deployment configuration

## Approach

1. **Create root `pnpm-workspace.yaml`** to declare frontend/ and backend/ as workspace packages

2. **Create root `package.json`** with:
   - `"workspaces": ["frontend/", "backend/"]` (or use pnpm-workspace.yaml)
   - `"dev": "pnpm -r --parallel dev"` to run all workspace dev scripts
   - `"build": "pnpm -r build"` to build all workspaces
   - `"lint": "pnpm -r lint"` to lint all workspaces

3. **Update backend/package.json**: Ensure `"dev"` script uses `tsx watch` (already present)

4. **Update frontend/package.json**: Ensure `"dev"` script uses `vite` (already present)

5. **Optional**: Add TypeScript root config or rely on workspace-specific configs

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| Root `/package.json` | New | Root package.json with workspace config and scripts |
| Root `/pnpm-workspace.yaml` | New | Declare frontend/ and backend/ as workspace members |
| `frontend/package.json` | Verify | Ensure scripts work with pnpm -r |
| `backend/package.json` | Verify | Ensure scripts work with pnpm -r |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Existing node_modules conflicts | Low | Remove any existing root node_modules; fresh install |
| Port conflicts (both use 3000) | Low | Backend uses 3000, frontend uses 5173 (Vite default) - no conflict |
| Lockfile conflicts | Medium | Delete existing pnpm-lock.yaml, regenerate with `pnpm install` |

## Rollback Plan

1. Delete root `package.json`
2. Delete root `pnpm-workspace.yaml`
3. Delete root `pnpm-lock.yaml`
4. Run `pnpm install` in each workspace (frontend/, backend/) independently
5. Developers run two separate terminal commands again

## Dependencies

- pnpm v8+ (required for workspaces)
- No external packages required

## Success Criteria

- [ ] `pnpm install` at root creates single node_modules with all dependencies
- [ ] `pnpm dev` from root starts both frontend (Vite) and backend (tsx) concurrently
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:3000
- [ ] `pnpm build` builds both frontend and backend
- [ ] `pnpm lint` runs lint on frontend (backend has no lint script currently)
- [ ] TypeScript compiles without errors
