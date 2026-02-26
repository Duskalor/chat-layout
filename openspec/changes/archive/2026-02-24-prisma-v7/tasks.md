# Tasks: Upgrade Prisma to v7

## Phase 1: Dependencies Update

- [x] 1.1 Update `backend/package.json` - Change `prisma` version from `^5.22.0` to `^7.4.1`
- [x] 1.2 Update `backend/package.json` - Change `@prisma/client` version from `^5.22.0` to `^7.4.1`
- [x] 1.3 Run `pnpm install` in `backend/` to install updated dependencies
- [x] 1.4 Verify installed versions with `pnpm list prisma @prisma/client`

## Phase 2: Schema Configuration

- [x] 2.1 Modify `backend/prisma/schema.prisma` - Change `provider = "prisma-client-js"` to `provider = "prisma-client"`
- [x] 2.2 Create `backend/prisma/prisma.config.ts` with datasource configuration for Prisma v7
- [x] 2.3 Verify `prisma.config.ts` exports configuration object with `earlyAccess` and `schema` path

## Phase 3: Client Generation

- [x] 3.1 Run `npx prisma generate` in `backend/` to generate new TypeScript-based client
- [x] 3.2 Verify generated client exists in `node_modules/.prisma/client`
- [x] 3.3 Verify no Rust binaries in generated output (confirming pure TS engine)

## Phase 4: Build Verification

- [x] 4.1 Run `pnpm build` in `backend/` to verify TypeScript compilation
- [x] 4.2 Run `pnpm lint` in `backend/` to ensure code integrity
- [x] 4.3 Fix any TypeScript compilation errors if they arise

## Phase 5: Runtime Verification

- [x] 5.1 Start the backend server and verify "Database connected successfully" log appears
- [x] 5.2 Test login endpoint to verify auth service works with v7 client
- [x] 5.3 Test chat endpoint to verify chat service works with v7 client
- [x] 5.4 Test todo endpoint to verify todo service works with v7 client
- [x] 5.5 Verify DATABASE_URL is properly documented in `backend/.env.example`

## Phase 6: Rollback Preparation (Documentation)

- [x] 6.1 Document rollback steps in project notes if needed

## Post-Upgrade Fix: ESM/CommonJS Mismatch

- [x] Fix ESM/CommonJS mismatch - Changed tsconfig.json module from "CommonJS" to "NodeNext" to match Prisma v7's ESM-only generated code
- [x] Update Prisma client import in src/config/prisma.ts to use generated client from src/generated
- [x] Verify backend starts successfully with "Database connected successfully" log
