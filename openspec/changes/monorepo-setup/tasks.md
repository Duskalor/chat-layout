# Tasks: Monorepo Setup

## Phase 1: Infrastructure (Workspace Configuration)

- [x] 1.1 Create `pnpm-workspace.yaml` at project root with workspace declarations for `frontend/` and `backend/`
- [x] 1.2 Create root `package.json` with name "chat-layout", private: true, and scripts: dev, build, lint
- [x] 1.3 Run `pnpm install` at root to generate `pnpm-lock.yaml` and install all dependencies

## Phase 2: Verification (Monorepo Functionality)

- [x] 2.1 Test: Run `pnpm dev` from root and verify both frontend (localhost:5173) and backend (localhost:3000) start concurrently
- [x] 2.2 Test: Verify frontend is accessible at http://localhost:5173
- [x] 2.3 Test: Verify backend is accessible at http://localhost:3000
- [x] 2.4 Test: Run `pnpm build` from root and verify both frontend and backend build successfully
- [x] 2.5 Test: Run `pnpm lint` from root and verify linting executes on frontend
- [x] 2.6 Test: Run `cd frontend && pnpm dev` independently to verify frontend works without backend
- [x] 2.7 Test: Run `cd backend && pnpm dev` independently to verify backend works without frontend
