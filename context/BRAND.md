# Enthusiast Auto Brand Guidelines

## Color System

Enthusiast Auto uses a cohesive color palette with a dark navy header/footer and light content sections. All colors should be drawn from this palette to maintain brand consistency.

### Primary Brand Colors

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| **Red** | `#F90020` | `--color-brand-red` | Primary brand accent, CTAs, destructive actions |
| **Deep Blue** | `#005A90` | `--color-brand-deep-blue` | Primary accent on light backgrounds, vendor labels |
| **Blue** | `#2E90FA` | `--color-brand-blue` | Secondary accent, focus rings, interactive elements |
| **Gray 400** | `#CCCCCC` | `--color-brand-gray-400` | Borders, input fields, muted elements |
| **Gray 200** | `#DFE5EA` | `--color-brand-gray-200` | Light backgrounds, dividers, subtle borders |

### Dark Theme Colors (Header/Footer)

| Color | Hex | Usage |
|-------|-----|-------|
| **Navy Primary** | `#141721` | Dark backgrounds (header, footer, hero sections) |
| **Navy Secondary** | `#1f2233` | Elevated surfaces, cards in dark mode, buttons on light |
| **Navy Tertiary** | `#1a1d29` | Subtle elevation, secondary backgrounds |
| **Navy Quaternary** | `#252936` | Higher elevation |
| **Navy Quinary** | `#2a2f3f` | Highest elevation, inputs, borders in dark mode |

### Text Colors

#### Dark Mode (on navy backgrounds)
| Color | Hex | Usage |
|-------|-----|-------|
| **Text Primary** | `#ffffff` | Headings, important text |
| **Text Secondary** | `#e5e7eb` | Body text, descriptions |
| **Text Tertiary** | `#a8adb7` | Muted text, metadata |
| **Text Quaternary** | `#6b7280` | Disabled, placeholder text |

#### Light Mode (on white backgrounds)
| Color | Hex | Usage |
|-------|-----|-------|
| **Text Primary** | `#282a30` | Headings, important text |
| **Text Secondary** | `#3c4149` | Body text |
| **Text Tertiary** | `#6f6e77` | Muted text, metadata, captions |

### Background Colors

#### Light Sections
| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#ffffff` | Primary light background |
| **Off-White** | `#f8f8f8` | Cards, subtle backgrounds |
| **Light Gray** | `#f4f4f4` | Secondary surfaces |
| **Muted** | `#f0f0f0` | Muted backgrounds |
| **Brand Gray 200** | `#DFE5EA` | Dividers, borders, input backgrounds |

---

## Usage Guidelines

### DO ✓

- Use `#005A90` (Deep Blue) for accent text, vendor labels, links on light backgrounds
- Use `#2E90FA` (Blue) for focus rings, hover states, interactive elements
- Use `#F90020` (Red) for primary CTAs, destructive actions, important alerts
- Use `#141721` (Navy Primary) for dark backgrounds matching header/footer
- Use `#1f2233` (Navy Secondary) for buttons and hover states on light backgrounds
- Use `#282a30` or `#1f2233` for primary text on light backgrounds
- Use `#6f6e77` for muted/tertiary text on light backgrounds
- Use `#DFE5EA` (Gray 200) for borders and dividers on light backgrounds

### DON'T ✗

- **Never use Tailwind blue classes** (`text-blue-*`, `bg-blue-*`) — use brand blues instead
- **Never use purple colors** — we don't have purple in our brand palette
- **Never use arbitrary colors** not in this document
- **Never mix color systems** — stick to the defined palette

### Component-Specific Colors

#### Product Cards (Light Mode)
```
Background:      #ffffff
Border:          #DFE5EA → #CCCCCC (hover)
Image BG:        gradient from #f8f8f8 to #f0f0f0
Vendor Label:    #005A90 (Deep Blue)
Title:           #1f2233 → #141721 (hover)
Price:           #1f2233
Divider:         #DFE5EA
Badge BG:        #141721/90
Button BG:       #141721 → #1f2233 (hover)
```

#### Header/Footer (Dark Mode)
```
Background:      #141721
Text Primary:    #ffffff
Text Secondary:  #a8adb7
Border:          #2a2f3f
Accent:          #2E90FA
```

#### Focus States
```
Focus Ring:      #2E90FA (Blue)
Focus Offset:    2px
Focus Width:     2px
```

---

## CSS Variables Reference

These CSS custom properties are defined in `globals.css`:

```css
/* Brand Colors */
--color-brand-red: #F90020;
--color-brand-deep-blue: #005A90;
--color-brand-blue: #2E90FA;
--color-brand-gray-400: #CCCCCC;
--color-brand-gray-200: #DFE5EA;

/* Dark theme */
--background: #141721;
--foreground: #ffffff;
--card: #1f2233;
--primary: #2E90FA;
--accent: #005A90;
--destructive: #F90020;
--border: #2a2f3f;
--ring: #2E90FA;

/* Light sections */
--background: #ffffff;
--foreground: #282a30;
--card: #f8f8f8;
--primary: #005A90;
--accent: #2E90FA;
--muted: #DFE5EA;
--muted-foreground: #6f6e77;
--border: #DFE5EA;
```
