# Proposal: clean-code-backend

## Intent

Refactor and secure the backend codebase to address critical security vulnerabilities (hardcoded passwords), eliminate technical debt (no input validation, no error handling, no auth middleware), and establish a maintainable code structure with proper separation of concerns.

## Scope

### In Scope
- Remove hardcoded passwords; implement environment-based configuration with `dotenv`
- Add input validation using `valibot` for all API endpoints
- Add global error-handling middleware
- Implement JWT authentication middleware
- Restrict CORS to frontend origin (not `*`)
- Split monolithic `index.ts` into modular structure: routes/, services/, types/, middleware/
- Add password hashing with `bcrypt`
- Fix inconsistent type naming (`createdAt` only)
- Remove non-null assertions
- Add async/await wrappers for Express routes

### Out of Scope
- Database implementation (keep in-memory for now)
- Frontend changes for JWT auth
- Logging infrastructure (pino)
- Testing setup
- API documentation

## Approach

1. **Security First**: Move credentials to `.env`, add JWT auth, restrict CORS
2. **Modularization**: Split `backend/src/index.ts` into:
   - `types/` - TypeScript interfaces
   - `routes/` - Express route handlers
   - `services/` - Business logic
   - `middleware/` - Auth, validation, error handling
   - `config/` - Environment configuration
3. **Validation**: Add Valibot schemas for login/logout/message payloads
4. **Refactoring**: Update existing code to use new modules

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/src/index.ts` | Modified | Refactor into modules |
| `backend/src/types/` | New | TypeScript interfaces |
| `backend/src/routes/` | New | Route handlers |
| `backend/src/services/` | New | Business logic |
| `backend/src/middleware/` | New | Auth, validation, error handling |
| `backend/src/config/` | New | Environment configuration |
| `backend/.env` | New | Environment variables |
| `backend/package.json` | Modified | Add dependencies (valibot, bcrypt, jsonwebtoken, dotenv, cors) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking frontend integration | Medium | Test with frontend; maintain API contracts |
| JWT token handling issues | Medium | Use standard implementation; test auth flow |
| Data loss during refactor | Low | Keep in-memory store; no DB changes |

## Rollback Plan

1. Revert to previous `backend/src/index.ts` (keep backup)
2. Remove new directories: routes/, services/, types/, middleware/, config/
3. Remove added dependencies from package.json
4. Restore original CORS and auth state

## Dependencies

- `valibot` - Input validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT auth
- `dotenv` - Environment config
- `cors` - CORS configuration

## Success Criteria

- [ ] No hardcoded passwords in source code
- [ ] All API endpoints validate input with Valibot
- [ ] Global error handler catches all unhandled errors
- [ ] JWT authentication protects API endpoints
- [ ] CORS restricted to frontend origin
- [ ] Backend code split into modular structure
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Login/logout/message functionality works end-to-end
