# Monorepo Infrastructure Specification

## Purpose

This specification defines the requirements for converting the project from a loosely-connected frontend/backend structure to a proper pnpm monorepo. The goal is to enable single-command development workflow while maintaining independent functionality of frontend and backend services.

## Requirements

### Requirement: Root Workspace Configuration

The project MUST have a root `pnpm-workspace.yaml` file that declares `frontend/` and `backend/` as workspace members.

#### Scenario: Workspace declaration

- GIVEN a project with frontend/ and backend/ directories
- WHEN the root pnpm-workspace.yaml is created with proper workspace declarations
- THEN pnpm MUST recognize both directories as workspace packages
- AND dependencies installed at root MUST be available to all workspaces

### Requirement: Root package.json Scripts

The root package.json MUST define scripts for operating on all workspaces concurrently.

#### Scenario: Run dev command from root

- GIVEN a properly configured monorepo with root package.json
- WHEN developer runs `pnpm dev` from project root
- THEN both frontend and backend dev servers MUST start concurrently
- AND frontend MUST be accessible at http://localhost:5173
- AND backend MUST be accessible at http://localhost:3000

#### Scenario: Run build command from root

- GIVEN a properly configured monorepo
- WHEN developer runs `pnpm build` from project root
- THEN both frontend and backend MUST be built
- AND build artifacts MUST be generated in respective output directories

#### Scenario: Run lint command from root

- GIVEN a properly configured monorepo
- WHEN developer runs `pnpm lint` from project root
- THEN linting MUST run on all workspaces that have lint scripts

### Requirement: Workspace Independence

Each workspace (frontend/, backend/) MUST remain functional when run independently.

#### Scenario: Run frontend dev independently

- GIVEN a monorepo with frontend workspace configured
- WHEN developer runs `cd frontend && pnpm dev`
- THEN frontend dev server MUST start normally
- AND backend is NOT required to be running

#### Scenario: Run backend dev independently

- GIVEN a monorepo with backend workspace configured
- WHEN developer runs `cd backend && pnpm dev`
- THEN backend dev server MUST start normally
- AND frontend is NOT required to be running

### Requirement: Dependency Management

The monorepo MUST use a single lockfile and shared node_modules where possible.

#### Scenario: Install dependencies at root

- GIVEN a fresh monorepo setup
- WHEN developer runs `pnpm install` at root
- THEN a single pnpm-lock.yaml MUST be generated at root
- AND all workspace dependencies MUST be installed
- AND workspaces MUST share hoisted dependencies when appropriate

#### Scenario: Add dependency to workspace

- GIVEN a working monorepo
- WHEN developer runs `pnpm add <package> -w` (workspace root) or `pnpm add <package>` in a workspace
- THEN the dependency MUST be added to the correct workspace's package.json
- AND lockfile MUST be updated accordingly

### Requirement: TypeScript Configuration

The monorepo MUST support TypeScript compilation without errors.

#### Scenario: TypeScript compilation

- GIVEN a properly configured monorepo with TypeScript
- WHEN developer runs `pnpm -r build` or workspace-specific build
- THEN TypeScript MUST compile without errors in all workspaces

## MODIFIED Requirements

### Requirement: Existing Workspace Scripts Compatibility

Existing scripts in frontend/package.json and backend/package.json MUST remain functional with pnpm workspace commands.

#### Scenario: Verify frontend dev script compatibility

- GIVEN frontend/package.json with existing "dev" script
- WHEN pnpm runs workspace dev command
- THEN the existing script MUST execute unchanged
- (Previously: Works only when run from frontend/ directory directly)

#### Scenario: Verify backend dev script compatibility

- GIVEN backend/package.json with existing "dev" script
- WHEN pnpm runs workspace dev command
- THEN the existing script MUST execute unchanged
- (Previously: Works only when run from backend/ directory directly)

## ADDED Requirements

### Requirement: Root Workspace Awareness

The project SHOULD have a root package.json with minimal configuration to enable workspace commands.

#### Scenario: Root package.json presence

- GIVEN a new developer cloning the repository
- WHEN they run `pnpm install` at root
- THEN root package.json MUST exist with valid JSON
- AND pnpm-workspace.yaml MUST exist with workspace declarations
