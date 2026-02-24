# Tasks: Get Better Styles

## Phase 1: Foundation - Design Tokens

- [x] 1.1 Add color palette tokens to `src/index.css` (@theme block): primary (#005c4b), primary-hover (#294b43), primary-light (#e8f5f1), secondary (#667781), surface (#ffffff), surface-alt (#f0f2f5), border (#e0e0db), text-primary (#1a1a1a), text-secondary (#667781), text-inverse (#ffffff)
- [x] 1.2 Add shadow tokens to `src/index.css`: shadow-sm (0 1px 2px), shadow-md (0 4px 6px), shadow-lg (0 10px 15px)
- [x] 1.3 Add border-radius tokens to `src/index.css`: radius-sm (4px), radius-md (8px), radius-lg (12px), radius-full (9999px)
- [x] 1.4 Add spacing tokens to `src/index.css`: spacing-xs (4px), spacing-sm (8px), spacing-md (16px), spacing-lg (24px), spacing-xl (32px)

## Phase 2: Core Components

- [x] 2.1 Update `src/components/sidebar.tsx` - Replace search input `bg-green-200` with `bg-surface-alt`, add focus ring with `focus:ring-primary/20`, add transition-all
- [x] 2.2 Update `src/components/sidebar.tsx` - Replace chat item hover `hover:bg-green-300` with `hover:bg-surface-alt`
- [x] 2.3 Update `src/components/sidebar.tsx` - Replace active chat item `bg-green-200` with `bg-primary-light`
- [x] 2.4 Update `src/components/sidebar.tsx` - Replace avatar `bg-green-400` with `bg-primary text-text-inverse`
- [x] 2.5 Update `src/components/sidebar.tsx` - Replace container border `border-r-gray-200` with `border-border`
- [x] 2.6 Update `src/components/chat.tsx` - Replace header container `bg-white shadow` with `bg-surface shadow-sm`
- [x] 2.7 Update `src/components/chat.tsx` - Replace avatar `bg-blue-500` with `bg-primary text-text-inverse font-semibold`
- [x] 2.8 Update `src/components/chat.tsx` - Replace chat name `font-bold` with `font-semibold text-text-primary`
- [x] 2.9 Update `src/components/chat.tsx` - Replace status text `text-gray-500` with `text-text-secondary`
- [x] 2.10 Update `src/components/chat.tsx` - Replace messages area `bg-white` with `bg-surface-alt`

## Phase 3: Message Components

- [x] 3.1 Update `src/components/userChat.tsx` - Replace outgoing message bubble `bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none` with `bg-primary text-text-inverse px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm`
- [x] 3.2 Update `src/components/userChat.tsx` - Replace timestamp `text-gray-500` with `text-text-secondary`, add `mt-1.5`
- [x] 3.3 Update `src/components/anotherChat.tsx` - Replace incoming message bubble `bg-gray-100 p-3 rounded-lg rounded-tl-none` with `bg-surface p-3 rounded-2xl rounded-tl-sm shadow-sm`
- [x] 3.4 Update `src/components/anotherChat.tsx` - Replace timestamp `text-gray-500` with `text-text-secondary`, add `mt-1.5`

## Phase 4: Input Component

- [x] 4.1 Update `src/components/Input.tsx` - Replace container `bg-white rounded-b-lg shadow p-4` with `bg-surface rounded-b-lg shadow-sm p-4`
- [x] 4.2 Update `src/components/Input.tsx` - Replace input field `border-gray-300` with `border-border`, add `rounded-xl`, update focus ring to `focus:ring-primary/30 focus:border-primary`, add `transition-all`
- [x] 4.3 Update `src/components/Input.tsx` - Replace send button `bg-[#005c4b]` with `bg-primary`, fix typo `text-text-invoice` to `text-text-inverse`, add `rounded-xl hover:bg-primary-hover transition-colors`

## Phase 5: Testing & Verification

- [x] 5.1 Run `pnpm build` to verify application builds without errors
- [x] 5.2 Run `pnpm lint` to verify code quality
- [x] 5.3 Verify all components render without crashes
- [x] 5.4 Verify no hardcoded green colors (bg-green-*, text-green-*) remain in component files
- [x] 5.5 Verify design tokens are applied consistently across all modified components

## Implementation Notes

- Phase 1 must be completed before any other phase (all components depend on design tokens)
- Phase 2 should be completed before Phase 3 and 4 (core layout components)
- Phase 3 and 4 can be done in parallel after Phase 2
- Phase 5 should be done after all implementation tasks are complete
- Fix any typos in button class (text-text-invoice -> text-text-inverse)
