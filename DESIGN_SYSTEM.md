# Sunday League App - Design System

**Version:** 1.0
**Last Updated:** March 2026
**Theme:** Stadium Night

---

## 1. Color Palette

### 1.1 Primary Colors

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Stadium 950 | `--stadium-950` | `#0a0f1a` | Deep background |
| Stadium 900 | `--stadium-900` | `#111827` | Card background |
| Stadium 800 | `--stadium-800` | `#1e293b` | Elevated surfaces |
| Stadium 700 | `--stadium-700` | `#334155` | Borders, dividers |

### 1.2 Accent Colors

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Pitch 500 | `--pitch-500` | `#22c55e` | Primary actions, success |
| Pitch 400 | `--pitch-400` | `#4ade80` | Hover states, highlights |
| Pitch 600 | `--pitch-600` | `#16a34a` | Active states |

### 1.3 Secondary Accent

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Floodlight 400 | `--floodlight-400` | `#fbbf24` | MOTM, awards |
| Floodlight 500 | `--floodlight-500` | `#f59e0b` | Warnings, highlights |

### 1.4 Position Colors

| Position | Token | Hex | Usage |
|----------|-------|-----|-------|
| Goalkeeper | `--gk` | `#fbbf24` | GK badges, highlights |
| Defender | `--def` | `#60a5fa` | DEF badges |
| Midfielder | `--mid` | `#4ade80` | MID badges |
| Forward | `--fwd` | `#f87171` | FWD badges |

### 1.5 Semantic Colors

| Purpose | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| Success | `#16a34a` | `#22c55e` | Success states |
| Error | `#dc2626` | `#ef4444` | Error states |
| Warning | `#d97706` | `#f59e0b` | Warning states |
| Info | `#2563eb` | `#3b82f6` | Info states |

---

## 2. Typography

### 2.1 Font Families

```css
/* Display (Headings) */
font-family: 'Bebas Neue', 'Impact', sans-serif;

/* Body (Content) */
font-family: 'DM Sans', system-ui, sans-serif;
```

### 2.2 Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `text-4xl` | 36px | Bold | 1.1 | Page titles |
| `text-2xl` | 24px | Bold | 1.2 | Card headers |
| `text-xl` | 20px | Semibold | 1.3 | Section headers |
| `text-lg` | 18px | Medium | 1.4 | Subheaders |
| `text-base` | 16px | Normal | 1.5 | Body text |
| `text-sm` | 14px | Normal | 1.5 | Secondary text |
| `text-xs` | 12px | Normal | 1.4 | Captions, labels |

### 2.3 Font Weights

| Name | Class | Value | Usage |
|------|-------|-------|-------|
| Normal | `font-normal` | 400 | Body text |
| Medium | `font-medium` | 500 | Labels, secondary |
| Semibold | `font-semibold` | 600 | Buttons, emphasis |
| Bold | `font-bold` | 700 | Headings |

---

## 3. Spacing System

Based on 4px grid unit.

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Icon gaps |
| `3` | 12px | Compact spacing |
| `4` | 16px | Standard gap |
| `5` | 20px | Section spacing |
| `6` | 24px | Card padding |
| `8` | 32px | Large gaps |

---

## 4. Components

### 4.1 Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Add Player
</button>
```
- Background: `pitch-500`
- Text: `stadium-950` (dark)
- Hover: `pitch-400`
- Shadow: Green glow

#### Secondary Button
```tsx
<button className="btn-secondary">
  Cancel
</button>
```
- Background: `stadium-800`
- Text: `white`
- Border: `stadium-700`
- Hover border: `pitch-500/50`

#### Danger Button
```tsx
<button className="btn-danger">
  Delete
</button>
```
- Background: `red-600`
- Text: `white`
- Hover: `red-500`

#### Icon Button
```tsx
<button className="p-2 text-gray-500 hover:text-pitch-400 rounded-lg">
  <Edit className="h-4 w-4" />
</button>
```

**Sizes:**
| Size | Padding | Icon | Usage |
|------|---------|------|-------|
| SM | `p-1.5` | 14px | Table actions |
| MD | `p-2` | 16px | Standard |
| LG | `p-3` | 20px | Floating actions |

---

### 4.2 Form Elements

#### Input Field
```tsx
<input
  type="text"
  className="input-field"
  placeholder="Enter text"
/>
```
- Background: `stadium-800`
- Border: `stadium-700`
- Focus: `pitch-500` ring
- Height: 44px (touch-friendly)

#### Select Field
```tsx
<select className="select-field">
  <option>Option 1</option>
</select>
```
- Same styling as input
- Custom dropdown arrow (SVG)

#### Checkbox
```tsx
<input
  type="checkbox"
  className="checkbox-field"
/>
```
- Size: 20px × 20px
- Checked: `pitch-500`

#### Form Label
```tsx
<label className="form-label">
  Field Name *
</label>
```
- Color: `gray-300`
- Size: `text-sm`

#### Form Field (with validation) - NEW
```tsx
<div className="form-field">
  <label className="form-label">Name *</label>
  <input className="input-field" />
  {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
</div>
```

---

### 4.3 Cards

#### Standard Card
```tsx
<div className="card">
  <h2 className="card-header">Title</h2>
  <p>Content</p>
</div>
```
- Background: `stadium-900/80`
- Border: `stadium-700/50`
- Padding: `p-5`
- Radius: `rounded-xl`

#### Stat Card
```tsx
<div className="stat-card">
  <div>
    <p className="text-sm text-gray-400">Label</p>
    <p className="text-3xl font-bold">42</p>
  </div>
  <div className="stat-card-icon">
    <Icon className="h-6 w-6" />
  </div>
</div>
```

---

### 4.4 Badges

#### Position Badges
```tsx
<span className="badge-gk">GK</span>
<span className="badge-def">DEF</span>
<span className="badge-mid">MID</span>
<span className="badge-fwd">FWD</span>
```

| Position | Background | Text | Border |
|----------|------------|------|--------|
| GK | `bg-gk/20` | `text-gk` | `border-gk/30` |
| DEF | `bg-def/20` | `text-def` | `border-def/30` |
| MID | `bg-mid/20` | `text-mid` | `border-mid/30` |
| FWD | `bg-fwd/20` | `text-fwd` | `border-fwd/30` |

#### Status Badge
```tsx
<span className="badge-success">
  <CheckCircle className="h-4 w-4" />
  Complete
</span>
```

---

### 4.5 Tables

```tsx
<div className="table-container">
  <table>
    <thead className="table-header">
      <tr>
        <th className="table-header-cell">Header</th>
      </tr>
    </thead>
    <tbody className="table-body">
      <tr className="table-row">
        <td className="table-cell">Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

| Element | Styling |
|---------|---------|
| Container | `overflow-hidden rounded-xl border` |
| Header | `bg-stadium-800/80` |
| Header Cell | `text-xs font-medium text-gray-400 uppercase` |
| Body | `divide-y divide-stadium-700/50` |
| Row | `hover:bg-stadium-800/50` |
| Cell | `px-6 py-4 text-sm` |

---

### 4.6 Tabs

```tsx
<nav className="border-b border-stadium-700">
  <button className="tab-button tab-button-active">
    Active Tab
  </button>
  <button className="tab-button tab-button-inactive">
    Inactive Tab
  </button>
</nav>
```

| State | Border | Text |
|-------|--------|------|
| Active | `pitch-500` | `pitch-400` |
| Inactive | `transparent` | `gray-500` |

---

### 4.7 Navigation

#### Desktop
- Height: 64px
- Sticky: `top-0 z-50`
- Background: `stadium-900/80` with backdrop blur
- Active: `bg-pitch-500/10 text-pitch-400 border-l-2`

#### Mobile
- Bottom position
- Icon + label stacked
- Touch-friendly targets

---

### 4.8 Toast Notifications

```tsx
<div className="fixed top-20 right-4 z-50">
  <div className="flex items-center space-x-3 px-4 py-3 rounded-lg border bg-pitch-500/10 border-pitch-500/30">
    <CheckCircle className="h-5 w-5 text-pitch-400" />
    <span>Success message</span>
  </div>
</div>
```

| Type | Background | Border | Icon |
|------|------------|--------|------|
| Success | `pitch-500/10` | `pitch-500/30` | `CheckCircle` |
| Error | `red-500/10` | `red-500/30` | `AlertCircle` |
| Info | `blue-500/10` | `blue-500/30` | `Info` |

---

### 4.9 Skeleton Loading - NEW

```tsx
<div className="skeleton">
  <div className="skeleton-card">
    <div className="skeleton-text skeleton-line" />
    <div className="skeleton-text skeleton-short" />
  </div>
</div>
```

```css
.skeleton {
  @apply animate-pulse bg-stadium-800 rounded;
}
.skeleton-line { @apply h-4 w-full; }
.skeleton-short { @apply h-4 w-2/3; }
.skeleton-card { @apply p-4 space-y-3; }
```

---

### 4.10 Empty States - NEW

```tsx
<div className="empty-state">
  <Users className="h-10 w-10 text-gray-600" />
  <p className="text-gray-400 font-medium">No players yet</p>
  <p className="text-gray-600 text-sm">Add your squad to start.</p>
  <Link href="/players/new" className="btn-primary mt-4">
    Add First Player
  </Link>
</div>
```

---

### 4.11 Confirm Dialog - NEW

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="card max-w-md">
    <h3 className="text-lg font-semibold mb-2">Delete Player?</h3>
    <p className="text-gray-400 mb-4">
      This will remove the player from all matches.
    </p>
    <div className="flex justify-end space-x-3">
      <button className="btn-secondary">Cancel</button>
      <button className="btn-danger">Delete</button>
    </div>
  </div>
</div>
```

---

## 5. Layout Patterns

### 5.1 Page Structure

```tsx
<>
  <Navigation />
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="page-title">Page Title</h1>
      <p className="page-subtitle">Subtitle</p>
    </div>
    {/* Page content */}
  </main>
</>
```

### 5.2 Page Header

| Element | Class | Description |
|---------|-------|-------------|
| Title | `page-title` | `text-4xl font-bold text-white` |
| Subtitle | `page-subtitle` | `text-gray-400 mt-1` |

### 5.3 Grid Layouts

#### 2-Column Stats
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* Stat cards */}
</div>
```

#### 4-Column Dashboard
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>
```

#### 3-Column Content
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {/* Content cards */}
</div>
```

---

## 6. Animations

### 6.1 Keyframes

```css
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  0% { boxShadow: 0 0 5px rgba(34, 197, 94, 0.3); }
  100% { boxShadow: 0 0 20px rgba(34, 197, 94, 0.6); }
}
```

### 6.2 Animation Classes

| Class | Duration | Effect | Usage |
|-------|----------|--------|-------|
| `animate-fade-in` | 0.5s | Opacity 0→1 | Page load |
| `animate-slide-up` | 0.4s | Slide + fade | Toasts, modals |
| `animate-glow` | 2s | Pulse glow | Active states |

### 6.3 Stagger Delays

```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

---

## 7. Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large screens |

---

## 8. Accessibility Guidelines

### 8.1 Color Contrast
- All text must meet WCAG AA (4.5:1 ratio)
- Primary green on dark: ✅ Passes
- Gray-400 on dark: ⚠️ borderline, use sparingly

### 8.2 Focus States
- All interactive elements must have visible focus
- Use `focus:ring-2 focus:ring-pitch-500`

### 8.3 ARIA Labels
```tsx
<button aria-label="Edit player" title="Edit player">
  <Edit className="h-4 w-4" />
</button>
```

### 8.4 Touch Targets
- Minimum size: 44px × 44px
- Icon buttons: `p-2` minimum

---

## 9. Dark Mode Guidelines

This design system is **dark-mode only**. Do not implement light mode.

**Rationale:**
- Stadium/night theme is core to brand identity
- Reduces development complexity
- Preferred by target users (evening match managers)

---

## 10. Do's and Don'ts

### Do ✅
- Use semantic color tokens (pitch, stadium, floodlight)
- Apply consistent spacing (4px grid)
- Include loading states for async operations
- Show empty states with CTAs
- Use position badges consistently

### Don't ❌
- Use hardcoded colors (always use tokens)
- Mix light and dark themes
- Use browser default confirm/alert
- Show tables without hover states
- Forget touch target sizes on mobile

---

## Appendix: Quick Reference

### Most Common Patterns

```tsx
// Page with navigation
<Navigation />
<main className="max-w-7xl mx-auto px-4 py-8">
  <h1 className="page-title">Title</h1>
  {/* content */}
</main>

// Card with header
<div className="card">
  <h2 className="card-header">Title</h2>
  {/* content */}
</div>

// Button row
<div className="flex justify-end space-x-3">
  <button className="btn-secondary">Cancel</button>
  <button className="btn-primary">Submit</button>
</div>

// Form field
<div>
  <label className="form-label">Label *</label>
  <input className="input-field" />
</div>
```
