# Component Library

## Overview

This project uses ShadCN UI components - a collection of accessible, reusable React components built with Radix UI and Tailwind CSS.

All components are located in `/components/ui/` and can be customized as needed.

## Available Components

### Button

Location: `components/ui/button.tsx`

**Variants:**

- `default` - Brand red background (primary CTAs)
- `secondary` - Brand blue background
- `destructive` - Red background (dangerous actions)
- `outline` - Border only
- `ghost` - Minimal styling
- `link` - Text link style

**Sizes:**

- `default` - 44px height (WCAG AA compliant)
- `sm` - 36px height
- `lg` - 48px height (better mobile UX)
- `icon` - 44px square
- `icon-lg` - 48px square

**Props:**

- `loading` - Shows spinner icon and disables interaction

**Example:**

```tsx
<Button variant="default" size="lg" loading={isLoading}>
  Add to Cart
</Button>
```

### Input

Location: `components/ui/input.tsx`

Styled text input with brand colors, focus states, and error handling.

**Features:**

- 44px height for accessibility
- Brand-blue focus ring
- Error state with red border/ring (use `aria-invalid`)
- Supports all standard input types

**Example:**

```tsx
<Input
  type="text"
  placeholder="Search..."
  aria-invalid={hasError}
  aria-describedby="error-message"
/>
```

### Select

Location: `components/ui/select.tsx`

Dropdown select component built with Radix UI.

Used in: VehicleSelector (Year/Model dropdowns)

**Example:**

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Checkbox

Location: `components/ui/checkbox.tsx`

Accessible checkbox component.

Used in: FilterPanel (vendor/category filters)

**Example:**

```tsx
<Checkbox
  id="checkbox-id"
  checked={isChecked}
  onCheckedChange={setIsChecked}
  aria-label="Label text"
/>
```

### Accordion

Location: `components/ui/accordion.tsx`

Collapsible content sections.

Used in: FilterPanel (Vehicle Fitment, Vendor, Category sections)

**Example:**

```tsx
<Accordion type="multiple" defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>Content goes here</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Badge

Location: `components/ui/badge.tsx`

Small status indicators.

**Variants:**

- `default`
- `secondary`
- `success` - Green (fitment compatible)
- `warning` - Yellow (check fitment)
- `destructive` - Red (errors)

**Example:**

```tsx
<Badge variant="success">Compatible</Badge>
```

### Card

Location: `components/ui/card.tsx`

Container component for content grouping.

**Example:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Skeleton

Location: `components/ui/skeleton.tsx`

Loading placeholder with shimmer animation.

**Example:**

```tsx
<Skeleton className="h-4 w-full" />
```

### Tooltip

Location: `components/ui/tooltip.tsx`

Hover tooltips for additional information.

**Example:**

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Dialog

Location: `components/ui/dialog.tsx`

Modal dialogs with backdrop.

**Example:**

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu

Location: `components/ui/dropdown-menu.tsx`

Context menus and dropdowns.

**Example:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Custom Components

### FilterPanel

Location: `components/FilterPanel.tsx`

Sidebar filter panel with vehicle fitment, vendor, and category filters.

Uses: Accordion, Checkbox, VehicleSelector

### VehicleSelector

Location: `components/VehicleSelector.tsx`

Year and Model selection dropdowns for BMW fitment filtering.

Uses: Select, Button

### FitmentBadge

Location: `components/FitmentBadge.tsx`

Visual indicator showing fitment compatibility.

Variants:

- Compatible (green checkmark)
- Check Fitment (yellow warning)
- Universal (gray badge)

Uses: Badge, Tooltip

## Accessibility

All components follow WCAG 2.1 AA standards:

- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and roles
- Minimum 44px touch targets
- Color contrast compliance
- Focus indicators

## Styling

Components use Tailwind CSS with design tokens defined in `app/globals.css`.

Brand colors can be accessed via CSS variables:

- `var(--color-brand-red)`
- `var(--color-brand-blue)`
- `var(--color-brand-navy)`
- `var(--color-brand-dark)`

## Resources

- [ShadCN UI Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
