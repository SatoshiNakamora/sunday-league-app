# Design System — NSFN Sunday League

## Product Context
- **What this is:** Team balancing and player tracking web app for casual 5-12 a side football clubs
- **Who it's for:** Sunday league managers who schedule matches, track stats, and balance teams
- **Space/industry:** Amateur sports management, recreational football
- **Project type:** Web app / dashboard with data-heavy tables and stats displays

## Aesthetic Direction
- **Direction:** Retro-Futuristic Sports Brutalism
- **Decoration level:** Expressive — layered atmospheric effects create stadium energy
- **Mood:** High-energy stadium atmosphere at night. Combines brutalist angular forms with retro-futuristic neon glows. Feels like a digital scoreboard meets 80s arcade aesthetic. Competitive, kinetic, memorable.
- **Key differentiators:**
  - Brutalist clipped corners (polygon clip-path) instead of rounded everything
  - Neon cyan (#00ffff) as primary accent with dramatic multi-layer glows
  - Film grain + scanline overlays for retro CRT texture
  - Scoreboard-style monospace numbers for all stats and metrics
  - Athletic condensed typography throughout (no generic sans-serifs)

## Typography
- **Display/Hero:** Archivo Black — Massive impact headers with gradient fills (white → cyan). Used for page titles and major section headers. Always uppercase.
- **Body:** Barlow Condensed — Athletic condensed proportions for all UI text, labels, and paragraphs. Increased letter-spacing (0.02em) for readability. Weight range: 400-900.
- **UI/Labels:** Barlow Condensed (same as body) — Bold weights (600-800) for buttons and emphasis
- **Data/Tables:** JetBrains Mono — Monospace with tabular-nums for scoreboard-style stat displays. Used for all numeric values to ensure alignment and digital display aesthetic.
- **Code:** JetBrains Mono
- **Loading:** Google Fonts CDN
  ```
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Archivo+Black&family=JetBrains+Mono:wght@400;500;600&display=swap');
  ```
- **Scale:**
  - 7xl (60px) — Page titles with gradient
  - 5xl (48px) — Scoreboard numbers
  - 3xl (30px) — Section headers
  - 2xl (24px) — Leaderboard scores
  - xl (20px) — Card headers (uppercase, tracking-widest)
  - base (16px) — Body text, labels
  - sm (14px) — Secondary text, uppercase labels
  - xs (12px) — Captions, metadata (uppercase, tracking-widest)

## Color
- **Approach:** Expressive — Color is a primary design tool. Neon accents with dramatic glows create atmosphere.
- **Primary:** #00ffff (Neon Cyan) — All interactive elements, active states, primary accent. Used with multi-layer text-shadow and box-shadow for glow effects.
- **Secondary Accents:**
  - Magenta: #ff00ff — Alerts, danger states, atmospheric gradients
  - Lime: #ccff00 — Success highlights
  - Purple: #8a2be2 — Special states, mixed gradients
- **Neutrals (Cool Grays):**
  - Stadium 950: #05080f — Deep black background
  - Stadium 900: #0c0f18 — Near black for cards
  - Stadium 800: #1a1d2e — Dark slate for elevated surfaces
  - Stadium 700: #2d3548 — Borders and dividers
  - White: #ffffff — Primary text
  - Gray 400: #9ca3af — Secondary text
  - Gray 500: #6b7280 — Tertiary text
- **Semantic (Position Colors):**
  - Goalkeeper: #fbbf24 — Golden yellow with glow
  - Defender: #60a5fa — Electric blue with glow
  - Midfielder: #4ade80 — Bright green with glow
  - Forward: #f87171 — Hot red with glow
- **Background Treatment:**
  - Radial gradients in corners (cyan 8% opacity at top-left, magenta 6% at bottom-right)
  - Linear gradient base (135deg from #05080f to #0c0f18)
  - Film grain overlay (4% opacity, mix-blend-mode: overlay)
  - Scanline effect (animated repeating gradient)
- **Dark mode:** This is a dark-mode-only system. The stadium night aesthetic is core to the brand identity.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — Dense enough for data tables, spacious enough for touch targets
- **Scale:**
  - 2xs: 2px — Borders, fine details
  - xs: 4px — Icon gaps
  - sm: 8px — Compact spacing
  - md: 16px — Standard gap between elements
  - lg: 24px — Section spacing
  - xl: 32px — Large gaps, padding
  - 2xl: 48px — Major section breaks
  - 3xl: 64px — Page-level spacing

## Layout
- **Approach:** Grid-disciplined with brutalist breaks — Strict grids for data/tables, angular overlapping cards for dashboard
- **Grid:**
  - Mobile: 1 column (full width)
  - Tablet (md): 2-3 columns
  - Desktop (lg): 3-4 columns
- **Max content width:** 1280px (7xl container)
- **Border radius:** None — All corners use polygon clip-path for brutalist angles
  - Large (clip-corner): 16px chamfered corners
  - Small (clip-corner-sm): 8px chamfered corners
  - Formula: `clip-path: polygon(0 0, calc(100% - Xpx) 0, 100% Xpx, 100% 100%, Xpx 100%, 0 calc(100% - Xpx))`

## Motion
- **Approach:** Expressive — Full choreography with scroll-driven reveals and kinetic hover states
- **Easing:**
  - Enter: ease-out, cubic-bezier(0.34, 1.56, 0.64, 1) for bouncy reveals
  - Exit: ease-in
  - Move: ease-in-out
- **Duration:**
  - Micro: 150ms — Hover color changes
  - Short: 300ms — Scale transforms, border changes
  - Medium: 500-600ms — Slide reveals, page transitions
  - Long: 1.5-3s — Looping animations (shimmer, pulse-glow)
- **Animations:**
  - `animate-slide-reveal` — Slide from left + scale on page load (600ms)
  - `animate-pulse-glow` — Glow intensity pulse on hover (1.5s loop)
  - `animate-shimmer` — Diagonal sweep overlay on buttons (3s loop)
  - `animate-border-pulse` — Border color oscillation (2s loop)
  - `animate-scanline` — Vertical scroll effect on body (8s loop)
- **Stagger delays:** .stagger-1 (100ms), .stagger-2 (200ms), .stagger-3 (300ms), .stagger-4 (400ms)

## Visual Effects
- **Neon Glows:**
  - Text: `text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5)`
  - Icons: `drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]`
  - Boxes: `box-shadow: 0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)`
- **Atmospheric Overlays:**
  - Film grain (SVG fractal noise, 4% opacity, mix-blend-mode: overlay)
  - Scanlines (repeating gradient, animated)
  - Radial color washes in corners
- **Gradient Text:**
  - `background: linear-gradient(180deg, #fff 0%, #00ffff 100%)`
  - `-webkit-background-clip: text`
  - `-webkit-text-fill-color: transparent`

## Component Patterns

### Stat Cards (Scoreboard Style)
```tsx
<div className="stat-card group hover:scale-105 transition-all duration-300">
  <p className="text-xs font-black text-cyan-400/70 uppercase tracking-widest">
    Label
  </p>
  <p className="text-5xl font-black text-white font-mono tabular-nums neon-text-cyan">
    {value.toString().padStart(2, '0')}
  </p>
  <div className="stat-card-icon">
    <Icon className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]" />
  </div>
</div>
```

### Buttons
```tsx
// Primary (Neon Gradient)
<button className="btn-primary">
  <Icon className="h-4 w-4" />
  <span>Action</span>
</button>

// Secondary (Outlined)
<button className="btn-secondary">Cancel</button>

// Danger (Magenta)
<button className="btn-danger">Delete</button>
```

### Position Badges
```tsx
<span className="badge-gk">GK</span>   // Golden yellow with glow
<span className="badge-def">DEF</span> // Blue with glow
<span className="badge-mid">MID</span> // Green with glow
<span className="badge-fwd">FWD</span> // Red with glow
```

### Data Tables
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

### Leaderboard Entries
```tsx
<div className="flex justify-between items-center py-3 px-3
                border-l-2 border-transparent
                hover:border-cyan-400 hover:bg-cyan-500/5
                clip-corner-sm">
  <span className="font-black text-cyan-500/50 font-mono">#{rank}</span>
  <span className="font-bold text-white uppercase">{name}</span>
  <span className="text-2xl font-black text-cyan-400 font-mono
                   drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
    {score}
  </span>
</div>
```

## CSS Custom Properties
```css
:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 5, 8, 15;
  --background-end-rgb: 12, 15, 24;
  --neon-cyan: 0, 255, 255;
  --neon-magenta: 255, 0, 255;
  --neon-lime: 204, 255, 0;
  --electric-purple: 138, 43, 226;
}
```

Use as: `rgba(var(--neon-cyan), 0.5)` for alpha variants.

## Accessibility
- **Color Contrast:**
  - Cyan (#00ffff) on Stadium 950 (#05080f): >12:1 (AAA)
  - White on Stadium 950: >15:1 (AAA)
  - All text meets WCAG AA minimum (4.5:1 for body, 3:1 for large)
- **Touch Targets:** Minimum 44×44px for all interactive elements
- **Focus States:** All interactive elements have visible focus rings (cyan glow)
- **Motion:** Respects prefers-reduced-motion (if implemented)

## Anti-Patterns (Never Use)
- Generic sans-serifs as primary (Inter, Roboto, Arial)
- Uniform border-radius on everything (defeats brutalist aesthetic)
- Purple gradients as default accent (overused AI pattern)
- Centered layouts with uniform spacing (boring)
- 3-column icon grids (generic)
- Decorative blobs or abstract shapes (not on brand)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | Initial design system created | Retro-Futuristic Sports Brutalism chosen to differentiate from generic sports apps. Stadium night aesthetic matches Sunday League context (evening matches under floodlights). |
| 2026-04-06 | Neon cyan (#00ffff) as primary | High-energy, attention-grabbing, pairs with dark background for maximum contrast. Feels competitive and kinetic. |
| 2026-04-06 | Archivo Black + Barlow Condensed | Athletic condensed typography creates sports energy. Avoids generic Inter/Roboto. Display font has impact, body font is readable at all sizes. |
| 2026-04-06 | Brutalist clipped corners | Differentiates from rounded-everything trend. Angular forms feel competitive and structured (like pitch markings). |
| 2026-04-06 | Film grain + scanlines | Retro CRT aesthetic reinforces stadium scoreboard feeling. Adds texture without overwhelming content. |
| 2026-04-06 | Monospace for all numbers | Scoreboard digital display aesthetic. Ensures alignment in tables and stats. Reinforces athletic/competitive theme. |
