# Proposal: Upgrade Prisma to v7

## Intent

Upgrade Prisma ORM from v5.22.0 to the latest v7.x (currently 7.4.1). Prisma 7 represents a major architectural shift that removes the Rust-based query engine in favor of a pure TypeScript implementation, delivering 3x faster query execution, 90% smaller bundle sizes, and improved edge/serverless runtime support. This upgrade addresses technical debt and enables better performance for serverless deployments.

## Scope

### In Scope
- Upgrade `prisma` and `@prisma/client` packages in `backend/package.json` to v7
- Update `prisma/schema.prisma` generator provider from `prisma-client-js` to `prisma-client`
- Create new `prisma.config.ts` configuration file for dynamic configuration
- Run `prisma generate` to regenerate the client with new TypeScript-based engine
- Verify all database operations work correctly after upgrade
- Run type-check and lint to ensure code integrity

### Out of Scope
- Database migration changes (schema remains unchanged)
- Frontend changes
- Performance benchmarking (post-upgrade verification only)
- Edge runtime deployment testing

## Approach

1. **Update dependencies**: Install latest prisma and @prisma/client packages
2. **Update schema**: Change generator provider to `prisma-client`
3. **Create config file**: Add `prisma.config.ts` for datasource configuration
4. **Regenerate client**: Run `npx prisma generate`
5. **Verify**: Test application functionality and run type-check/lint

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/package.json` | Modified | Update prisma and @prisma/client versions |
| `backend/prisma/schema.prisma` | Modified | Change generator provider |
| `backend/prisma/config.ts` | New | New Prisma v7 config file |
| `backend/src/config/prisma.ts` | Modified | May need updates for new client initialization |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Query API breaking changes | Low | Prisma maintains backward compatibility; test all DB operations |
| Type generation failures | Low | Clean node_modules and regenerate if issues occur |
| Runtime errors with new client | Low | Test application thoroughly after upgrade |

## Rollback Plan

1. Revert `backend/package.json` to original prisma versions (5.22.0)
2. Revert `prisma/schema.prisma` generator to `prisma-client-js`
3. Delete `prisma.config.ts`
4. Run `npx prisma generate` to regenerate old client
5. Reinstall dependencies with `pnpm install`

## Dependencies

- Node.js 18+ (required for Prisma v7)
- PostgreSQL database (unchanged)

## Success Criteria

- [ ] Prisma and @prisma/client upgraded to v7.x
- [ ] Schema generator updated to `prisma-client` provider
- [ ] Prisma config file created
- [ ] `pnpm build` passes without errors
- [ ] `pnpm lint` passes without errors
- [ ] Application starts and connects to database successfully
