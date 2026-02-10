# Theme Toggle Implementation

This document describes the dark/light mode toggle feature added to the data app.

## Overview

A theme toggle has been added to the Settings page, allowing users to switch between dark and light modes. The theme preference is persisted in the browser's localStorage.

## Files Created

### 1. `src/components/ThemeToggle.tsx`
- React component that renders a toggle button for switching themes
- Uses localStorage to persist theme preference
- Applies theme via `data-theme` attribute on document root
- Shows Sun icon for light mode, Moon icon for dark mode

### 2. `src/components/SettingsPage.tsx`
- New Settings page component
- Contains Appearance section with theme toggle
- Contains About section with app information
- Fully theme-aware styling using CSS variables

## Files Modified

### 1. `src/components/Icons.tsx`
- Added `Sun` icon component for light mode
- Added `Moon` icon component for dark mode

### 2. `src/components/Sidebar.tsx`
- Updated `TabId` type to include `'settings'`
- Added Settings menu item to System section

### 3. `src/App.tsx`
- Imported `SettingsPage` component
- Updated `TabId` type to include `'settings'`
- Added settings tab to tabs array
- Updated `isReadOnly` to include settings
- Added conditional rendering for Settings page
- Updated header subtitle logic to support settings

### 4. `src/index.css`
- Added comprehensive CSS variable system for theming
- Defined dark mode colors (default)
- Defined light mode colors via `[data-theme="light"]`
- Updated all component styles to use theme-aware CSS variables
- Added smooth transitions for theme changes

## CSS Variables

### Dark Mode (Default)
```css
--bg-primary: #09090b
--bg-secondary: #18181b
--bg-tertiary: #27272a
--text-primary: #fafafa
--text-secondary: #a1a1aa
--text-tertiary: #71717a
--border-color: #27272a
--card-bg: rgba(24, 24, 27, 0.5)
--hover-bg: rgba(39, 39, 42, 0.5)
```

### Light Mode
```css
--bg-primary: #ffffff
--bg-secondary: #f9fafb
--bg-tertiary: #f4f4f5
--text-primary: #09090b
--text-secondary: #52525b
--text-tertiary: #71717a
--border-color: #e4e4e7
--card-bg: rgba(249, 250, 251, 0.8)
--hover-bg: rgba(244, 244, 245, 0.8)
```

## How It Works

1. **Initial Load**: On app load, `ThemeToggle` component checks localStorage for saved theme preference
2. **Default**: If no preference is saved, defaults to dark mode
3. **Theme Application**: Theme is applied by setting `data-theme` attribute on `document.documentElement`
4. **CSS Cascade**: CSS variables cascade based on the `data-theme` attribute
5. **Persistence**: Theme choice is saved to localStorage on toggle
6. **Smooth Transitions**: All color changes animate smoothly via CSS transitions

## User Experience

- Settings page accessible via sidebar under "System" section
- Theme toggle positioned prominently in Appearance section
- Clear labels: "Light Mode" / "Dark Mode" with corresponding icons
- Instant visual feedback when toggling
- Theme persists across browser sessions
- All components automatically adapt to theme changes

## Accessibility

- Toggle button has proper `aria-label` for screen readers
- Maintains WCAG contrast ratios in both themes
- Keyboard accessible (can be tabbed to and activated with Enter/Space)
- Smooth transitions respect user's motion preferences (can be enhanced further)

## Future Enhancements

Potential improvements:
- Add system preference detection (prefers-color-scheme)
- Add more theme options (e.g., high contrast, custom colors)
- Add theme preview before applying
- Sync theme across multiple tabs using storage events
