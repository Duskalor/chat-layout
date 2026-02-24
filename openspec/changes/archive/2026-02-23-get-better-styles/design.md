# Technical Design: Get Better Styles

## Overview

This document outlines the technical implementation for improving the visual styling of the chat application. The current implementation uses hardcoded green theme colors (`bg-green-200`, `bg-green-300`, `bg-green-400`) and inconsistent styling across components.

## Design Tokens (index.css)

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#005c4b` | Primary brand color (WhatsApp green) - buttons, sent messages |
| `--color-primary-hover` | `#294b43` | Hover state for primary color |
| `--color-primary-light` | `#e8f5f1` | Light background variant |
| `--color-secondary` | `#667781` | Secondary text, muted elements |
| `--color-surface` | `#ffffff` | Card/component backgrounds |
| `--color-surface-alt` | `#f0f2f5` | Alternative surfaces, incoming messages |
| `--color-border` | `#e0e0db` | Borders, dividers |
| `--color-text-primary` | `#1a1a1a` | Primary text |
| `--color-text-secondary` | `#667781` | Secondary/muted text |
| `--color-text-inverse` | `#ffffff` | Text on dark backgrounds |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | `4px` | Tight spacing |
| `--spacing-sm` | `8px` | Small gaps |
| `--spacing-md` | `16px` | Default padding |
| `--spacing-lg` | `24px` | Large gaps |
| `--spacing-xl` | `32px` | Section spacing |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle shadows |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Card/component shadows |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Elevated elements |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Small elements |
| `--radius-md` | `8px` | Default rounded corners |
| `--radius-lg` | `12px` | Larger rounded corners |
| `--radius-full` | `9999px` | Pills, avatars |

## Component Modifications

### 1. index.css

**Changes:**
- Extend `@theme` block with design tokens
- Add custom color palette
- Add spacing, shadow, and border-radius tokens

```css
@theme {
  --color-primary: #005c4b;
  --color-primary-hover: #294b43;
  --color-primary-light: #e8f5f1;
  --color-secondary: #667781;
  --color-surface: #ffffff;
  --color-surface-alt: #f0f2f5;
  --color-border: #e0e0db;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #667781;
  --color-text-inverse: #ffffff;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

### 2. sidebar.tsx

**Current Issues:**
- Hardcoded `bg-green-200` on search input
- Hardcoded `bg-green-300/400` on hover and avatars
- Inconsistent padding and spacing

**Proposed Changes:**

| Element | Current Class | New Class |
|---------|---------------|-----------|
| Container | `xl:px-3 py-2 border-r-2 border-r-gray-200` | `xl:px-3 py-4 border-r border-border` |
| Search Input | `w-full bg-green-200 rounded h-[30px] outline-none px-3 py-5` | `w-full bg-surface-alt rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all` |
| Chat Item Default | `hover:bg-green-300` | `hover:bg-surface-alt` |
| Chat Item Active | `bg-green-200` | `bg-primary-light` |
| Avatar | `bg-green-400` | `bg-primary text-text-inverse` |

### 3. chat.tsx

**Current Issues:**
- Basic white header with simple shadow
- Status indicator uses static text

**Proposed Changes:**

| Element | Current Class | New Class |
|---------|---------------|-----------|
| Header Container | `bg-white rounded-t-lg shadow p-4` | `bg-surface rounded-t-lg shadow-sm p-4` |
| Avatar | `bg-blue-500` | `bg-primary text-text-inverse font-semibold` |
| Chat Name | `font-bold` | `font-semibold text-text-primary` |
| Status Text | `text-sm text-gray-500` | `text-sm text-text-secondary` |
| Messages Area | `bg-white overflow-y-auto p-4 space-y-4` | `bg-surface-alt overflow-y-auto p-4` |

### 4. userChat.tsx (Outgoing Messages)

**Current Issues:**
- Hardcoded `#005c4b` color
- Basic rounded corners
- No shadow

**Proposed Changes:**

| Element | Current Class | New Class |
|---------|---------------|-----------|
| Message Bubble | `bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none` | `bg-primary text-text-inverse px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm` |
| Timestamp | `text-xs text-gray-500 mt-1 block text-right` | `text-xs text-text-secondary mt-1.5 block text-right` |

### 5. anotherChat.tsx (Incoming Messages)

**Current Issues:**
- Uses hardcoded gray colors
- Basic styling

**Proposed Changes:**

| Element | Current Class | New Class |
|---------|---------------|-----------|
| Message Bubble | `bg-gray-100 p-3 rounded-lg rounded-tl-none` | `bg-surface p-3 rounded-2xl rounded-tl-sm shadow-sm` |
| Timestamp | `text-xs text-gray-500 mt-1` | `text-xs text-text-secondary mt-1.5` |

### 6. Input.tsx

**Current Issues:**
- Inconsistent border styling
- Button uses hardcoded color

**Proposed Changes:**

| Element | Current Class | New Class |
|---------|---------------|-----------|
| Container | `bg-white rounded-b-lg shadow p-4` | `bg-surface rounded-b-lg shadow-sm p-4` |
| Input Field | `flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-300` | `flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all` |
| Send Button | `bg-[#005c4b] cursor-pointer text-white p-2 rounded-r-lg hover:bg-[#294b43]` | `bg-primary text-text-invoice p-2.5 rounded-xl hover:bg-primary-hover transition-colors cursor-pointer` |

## Implementation Order

1. **Phase 1: Design Tokens** - Update `index.css` with all design tokens
2. **Phase 2: Core Components** - Update `sidebar.tsx` and `chat.tsx`
3. **Phase 3: Message Components** - Update `userChat.tsx` and `anotherChat.tsx`
4. **Phase 4: Input Component** - Update `Input.tsx`
5. **Phase 5: Verification** - Build and verify no visual regressions

## Testing Checklist

- [ ] Application builds without errors (`pnpm build`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] All components render without crashes
- [ ] Color theme is consistent across all components
- [ ] Hover states work correctly
- [ ] Input focus states are visible
- [ ] Message bubbles have proper spacing and shadows
- [ ] Avatars use consistent styling
- [ ] No green hardcoded colors remain in components

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Styling conflicts | Maintain existing className structure, only replace hardcoded colors with design tokens |
| Inconsistent application | Use design token CSS variables (e.g., `bg-primary`, `text-text-secondary`) consistently |
| Responsive issues | Keep existing responsive classes (`xl:`, etc.) and only modify color/spacing |

## Dependencies

- Tailwind CSS v4 (already configured)
- No new dependencies required
- All styling uses Tailwind utility classes and CSS variables

## Files to Modify

| File | Type | Changes |
|------|------|---------|
| `src/index.css` | Modify | Add design tokens to @theme block |
| `src/components/sidebar.tsx` | Modify | Replace green colors with design tokens |
| `src/components/chat.tsx` | Modify | Improve header styling with design tokens |
| `src/components/userChat.tsx` | Modify | Polish message bubble with design tokens |
| `src/components/anotherChat.tsx` | Modify | Polish message bubble with design tokens |
| `src/components/Input.tsx` | Modify | Improve input and button styling |
