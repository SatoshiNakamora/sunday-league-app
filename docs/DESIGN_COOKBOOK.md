# Design Cookbook: Retro-Futuristic Components

Quick reference for implementing components in the new design system.

---

## 🎯 Quick Patterns

### Scoreboard Number Display
```tsx
<div className="text-5xl font-black text-white font-mono tabular-nums neon-text-cyan">
  {value.toString().padStart(2, '0')}
</div>
```
**Effect**: Monospace numbers with cyan glow, zero-padded

---

### Leaderboard Entry (Hover Accent)
```tsx
<div className="group flex justify-between items-center py-3 px-3
                border-l-2 border-transparent
                hover:border-cyan-400
                hover:bg-cyan-500/5
                transition-all duration-300
                clip-corner-sm">
  <div className="flex items-center space-x-3">
    <span className="text-sm font-black text-cyan-500/50 w-8 font-mono">
      #{rank}
    </span>
    <span className="font-bold text-white uppercase tracking-wide">
      {name}
    </span>
  </div>
  <span className="text-2xl font-black text-cyan-400 font-mono tabular-nums
                   drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
    {score}
  </span>
</div>
```
**Effect**: Left accent bar reveals on hover, glowing score

---

### Athletic Section Header
```tsx
<div className="flex items-center space-x-3 mb-6">
  <div className="p-2 bg-cyan-500/20 clip-corner-sm">
    <Icon className="h-6 w-6 text-cyan-400
                     drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
  </div>
  <h2 className="card-header !mb-0">
    Section Title
  </h2>
</div>
```
**Effect**: Icon in clipped box with glow, uppercase header with underline

---

### Data Card with Animated Border
```tsx
<div className="card animate-slide-reveal stagger-1
                hover:border-cyan-500/40
                transition-all duration-300">
  {/* content */}
</div>
```
**Effect**: Slides in on load, border glows on hover

---

### Brutalist Button (Primary)
```tsx
<button className="btn-primary flex items-center space-x-2">
  <Icon className="h-4 w-4" />
  <span>Action Text</span>
</button>
```
**Effect**: Cyan gradient, shimmer animation, clipped corners

---

### Brutalist Button (Secondary)
```tsx
<button className="btn-secondary flex items-center space-x-2">
  <Icon className="h-4 w-4" />
  <span>Cancel</span>
</button>
```
**Effect**: Outlined style, subtle glow on hover

---

### Position Badge (Colored)
```tsx
<span className="badge-fwd">FWD</span>
<span className="badge-mid">MID</span>
<span className="badge-def">DEF</span>
<span className="badge-gk">GK</span>
```
**Effect**: Clipped corners, colored border + glow, uppercase

---

### Input Field (Brutalist)
```tsx
<div className="mb-4">
  <label className="form-label">
    Field Label *
  </label>
  <input
    type="text"
    className="input-field"
    placeholder="Enter value..."
  />
</div>
```
**Effect**: Dark inset, cyan border, clipped corners, mono font

---

### Stat Card (4-column grid)
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="stat-card group hover:scale-105 transition-all
                  animate-slide-reveal stagger-1">
    <div className="flex-1">
      <p className="text-xs font-black text-cyan-400/70 uppercase
                     tracking-widest mb-2">
        Label
      </p>
      <p className="text-5xl font-black text-white font-mono
                     tabular-nums neon-text-cyan">
        42
      </p>
    </div>
    <div className="stat-card-icon group-hover:scale-110
                    transition-transform">
      <Icon className="h-7 w-7 text-cyan-400
                       drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
    </div>
  </div>
</div>
```
**Effect**: Scoreboard display, hover scale, icon animation

---

### Table (Data Grid Style)
```tsx
<div className="table-container">
  <table className="w-full">
    <thead className="table-header">
      <tr>
        <th className="table-header-cell">Header</th>
      </tr>
    </thead>
    <tbody className="table-body">
      <tr className="table-row">
        <td className="table-cell">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```
**Effect**: Clipped container, cyan borders, hover accents

---

### Navigation Link
```tsx
<Link
  href="/path"
  className={clsx(
    'nav-link',
    isActive && 'nav-link-active'
  )}
>
  <Icon className="h-5 w-5" />
  <span>Dashboard</span>
</Link>
```
**Effect**: Uppercase bold, left accent bar when active, glow

---

### Empty State
```tsx
<div className="empty-state">
  <Icon className="h-12 w-12 text-gray-600 mb-4" />
  <p className="text-gray-400 font-medium uppercase tracking-wide">
    No items yet
  </p>
  <p className="text-gray-600 text-sm mt-1">
    Add your first item to get started.
  </p>
  <Link href="/new" className="btn-primary mt-4">
    Add First Item
  </Link>
</div>
```
**Effect**: Centered layout, call-to-action button

---

### Page Header
```tsx
<div className="mb-8">
  <h1 className="page-title">Dashboard</h1>
  <p className="page-subtitle">Welcome to your manager</p>
</div>
```
**Effect**: Massive gradient title, cyan subtitle with glow

---

### Icon with Glow (Small)
```tsx
<Icon className="h-5 w-5 text-cyan-400
                 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
```

### Icon with Glow (Large)
```tsx
<Icon className="h-10 w-10 text-cyan-400
                 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
```

---

### Text with Neon Glow
```tsx
<span className="neon-text-cyan">Cyan Glow</span>
<span className="neon-text-magenta">Magenta Glow</span>
<span className="neon-text-lime">Lime Glow</span>
```

---

### Animated Stagger (Load Sequence)
```tsx
<div className="animate-slide-reveal stagger-1">{/* First */}</div>
<div className="animate-slide-reveal stagger-2">{/* Second */}</div>
<div className="animate-slide-reveal stagger-3">{/* Third */}</div>
<div className="animate-slide-reveal stagger-4">{/* Fourth */}</div>
```
**Effect**: Sequential slide-in from left with scale

---

### Clipped Corner Utility
```tsx
<div className="clip-corner">      {/* Large 16px angles */}</div>
<div className="clip-corner-sm">   {/* Small 8px angles */}</div>
```

---

### Card Hover Effect
```tsx
<div className="card hover:border-cyan-500/40 hover:scale-[1.02]
                transition-all duration-300">
  {/* content */}
</div>
```

---

### Form Field with Error
```tsx
<div className="mb-4">
  <label className="form-label">Name *</label>
  <input
    className={clsx(
      'input-field',
      error && 'border-red-500'
    )}
  />
  {error && (
    <p className="text-red-400 text-sm mt-1 font-medium">
      {error}
    </p>
  )}
</div>
```

---

### Monospace Numeric Badge
```tsx
<span className="inline-block px-3 py-1 bg-black/60 border-2
                 border-cyan-500/30 font-mono text-cyan-400
                 text-lg font-black clip-corner-sm">
  {value.toString().padStart(2, '0')}
</span>
```

---

### Gradient Text
```tsx
<h1 className="text-6xl font-black uppercase bg-gradient-to-br
               from-white to-cyan-400 bg-clip-text text-transparent">
  Title
</h1>
```

---

### Split Layout (70/30)
```tsx
<div className="flex flex-col md:flex-row md:items-center
                md:justify-between gap-4">
  <div className="flex-1">
    {/* Main content */}
  </div>
  <div className="flex items-center space-x-4">
    {/* Actions */}
  </div>
</div>
```

---

### Status Badge
```tsx
<span className="badge-success flex items-center space-x-1">
  <CheckCircle className="h-4 w-4" />
  <span>Complete</span>
</span>
```

---

## 🎨 Color Reference

### Utility Classes

**Backgrounds**
- `bg-black/60` - Semi-transparent black
- `bg-cyan-500/10` - Subtle cyan tint
- `bg-gradient-to-r from-cyan-500 to-cyan-400` - Cyan gradient

**Borders**
- `border-2 border-cyan-500/30` - Thin cyan border
- `border-l-2 border-cyan-400` - Left accent bar

**Text**
- `text-cyan-400` - Primary accent text
- `text-gray-400` - Secondary text
- `text-white` - Primary content

**Shadows (Glows)**
- `drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]` - Icon glow
- `shadow-[0_0_30px_rgba(0,255,255,0.15)]` - Box glow

---

## 🎬 Animation Timing

**Fast** (200ms): Hover states, focus rings
**Medium** (300ms): Scale transforms, border changes
**Slow** (500-600ms): Page transitions, reveals

---

## 📱 Responsive Patterns

### Mobile Stack → Desktop Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Stacks on mobile, 3 columns on desktop */}
</div>
```

### Hide on Mobile
```tsx
<div className="hidden md:block">
  {/* Desktop only */}
</div>
```

### Show on Mobile Only
```tsx
<div className="md:hidden">
  {/* Mobile only */}
</div>
```

---

## 🎯 Best Practices

1. **Always uppercase** for headers and labels
2. **Use mono font** for numbers and scores
3. **Apply glows** to icons and accent elements
4. **Add transitions** (300ms) to interactive elements
5. **Clip corners** on cards, buttons, and badges
6. **Stagger animations** for multiple elements (0.1s increments)
7. **Scale on hover** for cards and buttons (1.02-1.05)
8. **Use font-black** (900 weight) for emphasis
9. **Add tracking-wide/wider** for uppercase text
10. **Keep borders at 2px** for brutalist aesthetic

---

**Pro Tip**: Combine multiple effects for maximum impact:
```tsx
<div className="card clip-corner animate-slide-reveal stagger-1
                hover:scale-105 hover:border-cyan-500/40
                transition-all duration-300">
  {/* Multi-layered effects */}
</div>
```
