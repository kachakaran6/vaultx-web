# Vault X — UI Refactor Plan

A full design + implementation pass to fix inconsistency, excess padding, oversized sidebar, and the unfinished Settings page. Goal: compact, sleek, premium SaaS feel — think Linear / Raycast / Vercel dashboard density, not a marketing landing page.

---

## 0. Diagnosis (what's wrong today)

- **Sidebar** is too wide (~320px) for only 5 nav items — wastes ~15% of viewport on every page.
- **Padding** is uniform and large everywhere (24–32px on cards, search bar, page headers) — nothing is denser than anything else, so the eye has no hierarchy.
- **Empty states** float in giant boxes with huge icon circles — fine once, but repeated structure (category cards, analytics cards) all use the same heavy card style, making the page feel like stacked boxes rather than a system.
- **Settings page** mixes unrelated density: huge color swatches, oddly placed PIN inputs, inconsistent label casing ("EXPORT BACKUP" vs "Export Backup"), checkboxes with no visual state shown.
- **No consistent component system** — buttons, badges, cards each seem custom-styled rather than variants of one set.
- **Typography scale** is flat — headers, body, and labels don't have enough contrast in weight/size to create real hierarchy.

---

## 1. Design tokens

### Color (light + dark, both required)
```
--bg:            #FAFAFA   (light)  /  #0A0A0B (dark)
--surface:       #FFFFFF             /  #131316
--surface-2:     #F4F4F5             /  #1C1C1F   (hover/raised)
--border:        #E4E4E7             /  #26262B
--text:          #18181B             /  #F4F4F5
--text-muted:    #71717A             /  #9A9AA2
--text-faint:    #A1A1AA             /  #6B6B72

--accent:        #6366F1   (indigo — keep current brand accent)
--accent-hover:  #4F46E5
--accent-soft:   #EEF0FF             /  #1E1B3A   (badges, active nav bg)

--success:       #10B981
--danger:        #EF4444
--warning:       #F59E0B
```
Accent stays user-selectable (the 6 dots in Settings already do this) — wire it to a CSS variable `--accent` so changing it doesn't require a rebuild.

### Type
- Font: **Inter** (or `Geist Sans` if available) for UI text. Keep one family — no separate display face needed, this is a tool, not a brand page.
- Scale (compact, not editorial):
  - `text-xs` 12px / 16px — meta, badges, timestamps
  - `text-sm` 13px / 18px — body default, table cells, nav items
  - `text-base` 14px / 20px — inputs, buttons
  - `text-lg` 16px / 24px — card titles
  - `text-xl` 20px / 28px — page titles (e.g. "Recent Links")
  - `text-2xl` 24px / 32px — reserved, rarely used
- Weight: 400 body, 500 labels/buttons, 600 titles. Never go to 700+ — keeps it feeling refined, not loud.

### Spacing (this is the core fix)
Replace the current flat "everything is 24px" approach with a real scale, and **bias every default down one notch**:
```
--space-1: 4px   --space-2: 8px   --space-3: 12px
--space-4: 16px  --space-5: 20px  --space-6: 24px
--space-8: 32px
```
Rules:
- Page padding (content area around sidebar): `24px` max, not 32–40px.
- Card internal padding: `16px` (currently feels like 24–32px).
- Gap between cards/grid items: `12px`, not `20px+`.
- Sidebar internal padding: `12px` horizontal, not 24px.
- Top search bar height: `40px`, not the current ~52px bar with huge internal padding.

### Radius & elevation
- `--radius-sm: 6px` (badges, inputs)
- `--radius-md: 8px` (cards, buttons)
- `--radius-lg: 12px` (modals, popovers only)
- Shadows: one subtle level only — `0 1px 2px rgba(0,0,0,0.04)` on cards. No floating drop-shadows on static content. Reserve a visible shadow for dropdowns/modals.

---

## 2. Layout structure

### Sidebar — shrink from ~320px to **220px** (collapsible to **64px** icon-only rail)
- Logo block: reduce vertical padding, icon 28px not 36px.
- Nav items: 36px row height, 8px horizontal padding, icon 16px, label `text-sm`. Active state = `--accent-soft` background + `--accent` text + left 2px accent bar (replace the current full blue left border block, which reads heavy).
- Remove the large disabled-looking "+ Add New Link" button at the bottom of nav — move primary action to a persistent top-right button or keep only the floating action button (bottom-right `+`), not both. Pick one. **Recommendation: keep the floating `+` button only**, drop the sidebar CTA entirely — it's redundant and currently looks disabled/greyed which reads as broken.
- User footer block: compact to single row — avatar (28px) + name + link count as one `text-xs` muted line, 12px padding not 20px.
- Add collapse toggle (chevron) at the bottom of sidebar for icon-only mode — standard in Linear/Notion-style apps and immediately makes the app feel more "pro."

### Top bar
- Search input: 40px height, 13px font, icon 16px, placeholder muted. Remove excess left/right padding inside the input (currently looks ~16px each side, drop to 12px).
- Theme toggle: keep top-right, but align vertically centered with search bar, same 40px row.

### Page header pattern (applies to Home, Categories, Analytics, Settings)
- Title `text-xl` / 20px, subtitle `text-sm` muted directly under it, **8px gap** not 16px.
- Header row and first content block separated by `24px`, not `32–40px`.
- Right-aligned actions (e.g. "All Time", "Create Collection") same height as search bar (32px), not larger.

### Category pills (Home page filters)
- Reduce height to 32px, padding `8px 12px`, icon 14px, count badge smaller (`text-xs`, 18px diameter min-width, not a big rounded rect).
- Use `--surface-2` background by default, `--accent-soft` + `--accent` text only when active/selected — currently all pills look static/equal weight with no clear selected state.

### Cards (Category grid, Analytics stat cards)
- Padding: 16px, not 24–32px.
- Internal gap between icon/title/count: 8px, not 16–20px.
- Left accent bar (currently full-height colored bar per category): keep — it's the one genuinely nice signature element already in the design — but make it thinner (3px not 4–6px) and only show full saturation on hover/active, muted/desaturated at rest, so the grid isn't visually loud when everything is empty (0 links).
- Grid gap: 12px, not 20px+.

### Empty states (Home "Start building your vault")
- Shrink the icon circle from ~80px to 48px, icon 20px.
- Title `text-base` semibold, description `text-sm` muted, max-width 320px so text doesn't sprawl.
- Vertical padding inside the empty-state container: 48px, not the current ~80–100px — still generous since it's a focal moment, just not cavernous.

---

## 3. Settings page — specific rebuild

Current issues: inconsistent card padding, label casing, no visible toggle state, oddly large color swatches, PIN fields with unclear grouping.

Rebuild as a **single-column list of grouped settings sections** (this is the actual professional pattern — see Vercel/Linear/Raycast settings, not a 2-column card grid):

```
Settings
Manage your account settings and preferences.

── Appearance ───────────────────────────────
  Interface theme        [Auto] [Light] [Dark]   (segmented control, 32px height)
  Accent color            ● ● ● ● ● ●  (28px swatches, not 80px; checkmark on selected)

── Interaction ──────────────────────────────
  Open links externally                    [toggle switch]
  Push notifications                        [toggle switch]

── Security ──────────────────────────────────
  PIN lock                                  [toggle switch]
  New PIN        [____]   Confirm  [____]    (only shown when toggle is ON)

── Data ───────────────────────────────────────
  Export backup            [Plain text] [Encrypted JSON]  (segmented, not separate buttons)
  Encryption passphrase    [____________________] (optional)
  [Export Backup]  [Import Backup]
```

Key fixes:
- **Replace checkboxes with real toggle switches** (shadcn `Switch` component) — checkboxes read as broken/unstyled in a settings list.
- **Sentence case everywhere** — "Export backup" not "EXPORT BACKUP", "New PIN" not all caps unless it's a true section eyebrow label (12px, `--text-faint`, letter-spacing 0.04em, used consistently only for section dividers, not field labels).
- One column, max-width ~640px, so it doesn't stretch awkwardly on wide screens — settings pages should never go full-bleed.
- Color swatches: 28px circles, 8px gap, checkmark icon overlay on selected (already exists, just shrink it).
- Group spacing: 32px between sections, 16px between rows inside a section, 1px `--border` divider above each section label.

---

## 4. Component system → adopt shadcn/ui

Since the app is Vite + React, install shadcn properly so every button/input/card/switch/badge is the same primitive everywhere instead of bespoke CSS per page:

```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge switch tabs separator
npx shadcn@latest add dialog dropdown-menu tooltip avatar scroll-area
```

Map current ad-hoc elements →
| Current element | shadcn replacement |
|---|---|
| Category pills | `Badge` (variant="outline"/"secondary") wrapped in a button |
| Theme Auto/Light/Dark | `Tabs` (segmented style) or `ToggleGroup` |
| Checkboxes in Settings | `Switch` |
| "All Time" dropdown | `DropdownMenu` |
| Card containers | `Card` / `CardHeader` / `CardContent` with padding override to 16px |
| Add New Link / Create Collection buttons | `Button` (variant="default" for primary, "outline" for secondary) |
| Search bar | `Input` with leading icon slot |

Configure `tailwind.config.js` to read the token CSS variables above (`bg`, `surface`, `accent`, etc.) instead of raw Tailwind defaults, so the accent-color picker in Settings can actually theme the whole app at runtime via CSS variables rather than needing a rebuild.

---

## 5. Interaction & polish details (cheap wins, big perceived-quality jump)

- All buttons/pills: `transition: all 150ms ease` on hover/active states — currently nothing animates, which makes it feel static/template-y rather than "smooth."
- Active nav item, active category pill, focused input: consistent `--accent` ring/indicator across all of them — pick one accent treatment and reuse it everywhere (currently the left-bar-on-nav and pill-selection don't share a visual language).
- Inputs: focus ring `2px` solid `--accent-soft` outline + border color shift to `--accent`, not browser default.
- Floating `+` button: keep, but reduce to 48px diameter (currently looks ~64px), with a subtle scale-up (1.05) + shadow increase on hover.
- Dark mode: verify every token above has a dark value before shipping — right now toggling the moon icon should not just invert background but also drop shadow intensity and desaturate the colored category bars slightly so they don't glow.
- Loading/empty states should use a one-line muted message in the interface's voice ("No links saved yet — add your first one" rather than a vague icon-only state with no copy on smaller cards like Analytics' "No visitation data available." → keep that pattern, it's actually already good, just reduce its container padding to match the rest).

---

## 6. Build order (do it in this sequence so nothing breaks twice)

1. Install & configure shadcn + Tailwind tokens (Section 1 + 4).
2. Rebuild `Sidebar` component (220px / 64px collapsed, new nav item styling).
3. Rebuild shared `PageHeader` component (title/subtitle/actions row) — reuse on all 4 pages.
4. Rebuild `Card` padding globally (one shared `Card` wrapper, not per-page custom divs).
5. Rebuild `Settings` page from scratch using the single-column section layout in Section 3.
6. Pass over Home (category pills + empty state) and Categories grid for the new spacing scale.
7. Final QA pass: toggle dark mode on every page, toggle sidebar collapse on every page, resize to 1280px and 1440px to confirm no awkward stretch.

---

## 7. Quick before → after summary

| Area | Before | After |
|---|---|---|
| Sidebar width | ~320px | 220px (64px collapsed) |
| Page padding | 32–40px | 24px |
| Card padding | 24–32px | 16px |
| Search bar height | ~52px | 40px |
| Category pill height | ~44px | 32px |
| Settings layout | 2-column card grid, checkboxes | 1-column grouped list, switches, sentence case |
| Component system | Bespoke per-page CSS | shadcn/ui primitives + CSS variable tokens |
| Hover/focus states | None/minimal | Consistent 150ms transitions + accent ring |