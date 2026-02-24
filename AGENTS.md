# Agent Guidelines for chat-layout

## Commands
- `pnpm dev` - Start dev server | `pnpm build` - Type-check & build | `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build | `pnpm lint -- --fix` - Auto-fix lint issues

## Code Style
- **Language**: TypeScript + React 19 | **Styling**: Tailwind CSS v4
- **Imports**: Explicit (no path aliases) | **Components**: `.tsx`, utilities `.ts`
- **Types**: `src/assets/types/` | **State**: Zustand in `src/store/` | **Validation**: Valibot
- **Naming**: PascalCase components, camelCase functions/variables
- **Error Handling**: try/catch for async ops, show user-friendly messages
- **ESLint**: React hooks rules enforced; disable `react-hooks/exhaustive-deps` if needed

## Architecture
- Components: `src/components/` | Hooks: `src/hook/` | Layouts: `src/layout/`
- Routes: `src/route/routes.tsx` | Socket client: `src/lib/socket-client.ts`
