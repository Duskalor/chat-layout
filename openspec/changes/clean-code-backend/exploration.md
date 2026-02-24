## Exploration: clean-code-backend

### Current State

The backend is a monolithic Express + Socket.io server in a single file (`backend/src/index.ts`, 186 lines). It handles:
- REST API: `/auth/login`, `/auth/logout`
- Socket.io: connection, messages, sendMessage events
- In-memory data store with mock users and generated chats

### Affected Areas
- `backend/src/index.ts` — All backend logic (types, data, routes, socket handlers)

### Code Quality Issues

| Issue | Location | Severity |
|-------|----------|----------|
| **Hardcoded passwords in plaintext** | Lines 52-58 | Critical |
| **No input validation** | Lines 134-152 | High |
| **No error handling** | Routes & socket handlers | High |
| **No authentication middleware** | All routes unprotected | High |
| **Inconsistent type naming** (`createAt` vs `createdAt`) | Lines 24, 33, 45 | Medium |
| **Type duplication** (interfaces in same file) | Lines 19-49 | Medium |
| **No separation of concerns** | Single file for everything | Medium |
| **CORS wide open** (`origin: '*'`) | Line 10 | Medium |
| **Non-null assertions** (`!`) | Lines 72, 82, 92, etc. | Low |
| **No environment config** | PORT hardcoded fallback | Low |
| **Missing async handlers** | Express routes sync | Low |

### Structural Issues
1. **Monolithic file** — All code in one file; no route separation, no services layer
2. **No database layer** — In-memory arrays; data lost on restart
3. **No modular organization** — Types, data, handlers all mixed
4. **No logging infrastructure** — `console.log` used directly

### Recommendations

1. **Immediate fixes** (High Priority):
   - Add input validation (e.g., `zod` or `valibot`)
   - Add error-handling middleware
   - Add authentication middleware (JWT)
   - Remove hardcoded credentials; use environment variables

2. **Refactoring** (Medium Priority):
   - Split into modules: routes/, services/, types/
   - Add proper config management (`dotenv`)
   - Replace console.log with structured logger (`pino`)

3. **Security hardening** (Medium Priority):
   - Restrict CORS to frontend origin
   - Hash passwords (bcrypt)

### Risks
- Refactoring may break existing frontend integration
- Adding auth requires frontend changes

### Ready for Proposal
Yes. The codebase has clear issues that warrant a cleanup/refactoring change. The proposal should prioritize security fixes (passwords, auth) first, then structural improvements.
