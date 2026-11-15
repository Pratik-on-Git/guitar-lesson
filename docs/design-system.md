# Resonance — Guitar Notes design system

## Reference interpretation

The supplied image is a collection of tactile, illuminated instruments on a black canvas. Its identity comes from the relationship between deep neutral surfaces and concentrated colour: a cyan counter, an orange control, a violet button, a pink-to-cream display, a lime indicator, and pill-shaped playback controls. Fine borders and highlights suggest glass without making the whole interface transparent. Oversized, lightweight numerals contrast with restrained labels.

Resonance translates those relationships into a reading and music-practice application. It is an interpretation of the image, not an exact measurement of its colours or identification of its font. Inter is the chosen equivalent for its clean interface lettering and lightweight numerals. Gradients are reconstructed with CSS, so they stay sharp at every resolution.

The reference contains no light theme, error states, tables, navigation, or responsive reading layout. Those are designed here as extensions of the same principles.

## Foundations

1. **The content is the instrument.** Lessons, diagrams, and controls have clear grouping and a predictable hierarchy.
2. **Neutral first.** Most screen area is canvas and neutral cards. Concentrate vivid colour in feature surfaces, metrics, and important actions.
3. **Light follows form.** Use a thin upper highlight, subtle edge, and restrained shadow. Avoid glowing body text, heavy blur behind lessons, and shadows around every nested element.
4. **Colour has a job.** Cyan identifies interaction; lime marks growth; orange adds practice energy; violet suggests harmony; pink adds expression. Status colours remain semantic.
5. **State is explicit.** Pair colour with labels, checkmarks, selected borders, or position. Hover and selected states are distinct.
6. **Keep the music readable.** Fretboard, notation, chord, and chart colours use shared semantic tokens; decorative gradients never replace musical meaning.

## Architecture and source of truth

| File | Responsibility |
| --- | --- |
| `app/theme.css` | Complete light/dark semantic palette, spacing, gradient, elevation, and motion tokens |
| `app/globals.css` | Tailwind token bindings, typography, base rules, tables, scrollbar, animation utilities |
| `app/surfaces.css` | Shared surface materials, button finishes, fields, focus, touch targets, metronome, reduced motion |
| `components/ui/` | Reusable accessible control and surface primitives |
| `components/app/` | Page structure, navigation, badges, dashboard, and visual specimens |
| `components/music/` | Domain-specific tools built on those primitives |
| `/design-system` | Live visual reference with both themes, palettes, controls, and interaction examples |

Change tokens before introducing a local override. Use `Panel` for a titled content group, `Card` for a general container, `PageHeader` for page context, and `Section` for related groups. All existing routes inherit the system through the root layout. The design-system page is linked in the footer and is excluded from study-progress counts.

## Colour system

### Neutral and interactive tokens

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#F3F4F7` | `#09090C` | Page canvas |
| `foreground` | `#202127` | `#F2F3F7` | Headings and primary text |
| `card` | `#FFFFFF` | `#191A1F` | Lesson and tool surfaces |
| `popover` | `#FFFFFF` | `#222329` | Raised dialogs and menus |
| `muted` | `#ECEEF3` | `#25272E` | Inset tracks and quiet areas |
| `muted-foreground` | `#606571` | `#A5A8B5` | Secondary descriptions and labels |
| `secondary` | `#E9EBF0` | `#292B33` | Secondary action fill |
| `secondary-foreground` | `#353842` | `#E2E4EB` | Secondary action text |
| `accent` | `#E0F1F5` | `#23363E` | Hover and selection tint |
| `accent-foreground` | `#075C75` | `#B5E7F2` | Text on tinted surfaces |
| `primary` | `#076985` | `#8CDCF0` | Links, selected controls, root notes |
| `primary-foreground` | `#FFFFFF` | `#10252B` | Text on solid primary fill |
| `border` | `#D7DAE3` | `#353740` | Dividers and surface edges |
| `input` | `#B5BAC7` | `#535764` | Stronger input boundaries |
| `input-background` | `#FAFBFC` | `#14151A` | Recessed input surface |
| `ring` | `#087C9C` | `#9AE5F6` | Keyboard focus |
| `sidebar` | `#FAFBFC` | `#121317` | Navigation surface |
| `sidebar-foreground` | `#414650` | `#BFC2CE` | Navigation text |

`card-foreground` and `popover-foreground` follow `foreground`. Sidebar primary, accent, border, and focus tokens alias their corresponding semantic tokens.

### Status tokens

| State | Light | Dark | Meaning |
| --- | --- | --- | --- |
| Success | `#357329` | `#B9E78D` | Completed, studied, saved |
| Warning | `#96520B` | `#FFC273` | Needs attention or review |
| Info | `#345FBD` | `#9CBEFF` | Context, in-progress information |
| Destructive | `#B73346` | `#FF91A0` | Invalid, failed, destructive |
| Neutral | `#606571` | `#AFB4C3` | Not started, secondary status |

Soft badges use 10% semantic fill and 20% border; solid badges use the matching `*-foreground`. Do not use decorative orange as an error signal, or colour alone to communicate correctness.

### Decorative light

| Family | Gradient stops | Intended use |
| --- | --- | --- |
| Cyan | `#A5ECFF → #6FC2E8 → #C5E8D8` | Library metrics, tempo display, discovery |
| Lime | `#E9F9B0 → #B5DF87 → #F5EDAA` | Sidebar study progress |
| Orange | `#FFCC78 → #FFA13F → #FF7752` | Brand mark, practice metric |
| Violet | `#C9B0FF → #AD89ED → #F7C0E2` | Session metric, harmony accents |
| Pink | `#FCA3D8 → #FF79BB → #FFE5A0` | Expression and occasional highlights |
| Action | `#ABEBF5 → #B9E8BD → #E8F3A7` | Primary actions |

These gradients have the same stops in both themes, with dark `on-gradient: #20242B` text. This prevents the reference's very pale text on bright areas from becoming a readability problem. Neutral colours adapt around them. Feature banners are intentionally dark in either mode; their text is explicitly paired with the dark material.

### Data and music

`chart-1..5` provide theme-aware cyan, violet, pink, orange, and green. `series-1..6` provide categorical values; `seq-1..4` form a blue sequential scale. Blue `series-1` and `seq-3` retain a darker fill in both modes because existing rhythm and grid labels use white text. Always provide labels or legends. Do not randomly reassign colours between musical diagrams.

## Typography

### Capitalization

Use Title Case for page and section headings, navigation, buttons, field labels, dropdown options, and table headers. Lowercase short connecting words such as “and”, “of”, “the”, and “to” within a title. Keep descriptions, instructions, lesson paragraphs, and feedback messages in sentence case. Preserve acronyms, intentional internal capitals, note spellings, chord symbols, and roman degrees. Format display labels through `lib/title-case.tsx`; never alter stored values, URLs, or music identifiers for capitalization. Avoid forced-uppercase CSS on interface labels.

| Role | Family | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| Feature statement | Inter | 32–60px fluid | 300 | 1.05 |
| Page title | Inter | 32–44px fluid | 500 | 1.12 |
| Section heading | Inter | 17–18px fluid | 600 | About 1.55 |
| Card title | Inter | 15–16px fluid | 500–600 | 1.5 |
| Body | Inter | 14–16px | 400 | 1.5–1.7 |
| Interface label | Inter | 12–14px | 500 | 1.33–1.5 |
| Caption / eyebrow | Inter | 12px | 400–500 | 1.33 |
| Dashboard metric | Inter | 40–56px fluid | 300 | 1 |
| Tempo readout | Inter | 64px | 300 | 1.1 |
| Formula / precise notation | JetBrains Mono | 12–14px | 400–500 | 1.5 |

Use thin weights only at large sizes. Page titles track at −0.055em, feature headlines at −0.06em, metrics at −0.065em, and normal interface copy at −0.015em. Uppercase eyebrows use positive tracking. Numeric readouts use tabular figures to prevent width changes. Reserve serif lettering for existing notation-specific material.

Fonts are loaded by `next/font` in `app/layout.tsx` and served locally by Next.js. No additional font families or browser-time third-party font requests are required. Small chart notation may retain its domain-specific size; primary labels and dashboard supporting text use at least 12px.

## Spacing and layout

The base unit is 4px. Named spacing tokens: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px. Tailwind spacing uses the same 4px basis.

| Relationship | Spacing |
| --- | --- |
| Icon to label | 6–8px |
| Label to field | 8px |
| Related small controls | 8–12px |
| Card grid | 12–20px, depending on density and width |
| Card internal padding | 24px desktop / 16px mobile |
| Compact dashboard card | 20px / 18px mobile |
| Section heading to content | 16px |
| Related lesson sections | 20–24px |
| Dashboard sections | 32px |
| Design documentation sections | 40px |
| Feature internal padding | 24–40px |
| Page gutter | 16px mobile / 24px desktop |

Keep the page inside the existing 90rem maximum width. Desktop navigation occupies its own sticky column. Below 1024px, navigation becomes a modal sheet. Multi-column content collapses progressively; compact controls wrap. At phone sizes, charts stack, dashboard cards reorder coherently, and wide music diagrams/tables scroll inside their containers rather than widening the page.

## Shape and surface

| Element | Radius |
| --- | --- |
| Tiny dense controls | 2–3px explicit |
| Small containers | 4px (`radius-sm`) |
| Input / medium shape | 5px (`radius-md`) |
| Inset panel | 6px (`radius-lg`) |
| Card | 8px (`radius-xl`) |
| Feature | 10px (`radius-2xl`) |
| Large surface | 12–14px (`radius-3xl` / `radius-4xl`) |
| Buttons, including icon buttons | 5px (`radius-md`) |
| Decorative orb | Circle |

The global base radius is 6px (`--radius: 0.375rem`). Both themes use this compact scale. Custom feature surfaces, metronome readouts, table corners, and gallery specimens reference the same tokens rather than defining larger local radii. All buttons use the compact radius, including icon buttons. Decorative circular indicators retain their shapes.

Depth is built from three distinct materials:

- **Raised card:** a near-neutral diagonal gradient, thin perimeter, one upper inset highlight, and elevation 1.
- **Inset control:** darker or cooler fill with a small inner shadow; readable boundary and no floating shadow.
- **Illuminated accent:** stable pastel gradient, dark text, a stronger upper highlight, and a restrained shadow. Keep it occasional.

Elevation 1 is for cards and selected segments, elevation 2 for hovered feature tiles, and elevation 3 for major overlays. Backdrop blur belongs to the toolbar and modal backdrop. Avoid applying it to every lesson panel.

## Component contracts

### PageHeader and Section

One primary h1 per page. Keep description width near 68 characters. Actions align right when space allows and wrap below on narrow screens. Metadata is separate from the title. Sections use consistent headings and optional trailing controls.

### Card and Panel

Card defines the material, perimeter, radius, and spacing variable. Panel composes Card with a titled header, optional action, divider, and body. Music tools use Panel so controls and reading material share the same container language. Nested diagrams remain neutral or recessed.

### Button

- Default: luminous cyan/lime surface, dark text, one upper highlight.
- Outline: neutral card fill and clear border; tint on hover.
- Secondary: visible neutral fill, input-strength border, and subtle upper highlight. Use for supporting actions beside a primary action, navigation to related tools, playback, export, and previous/next controls. Hover strengthens the fill and boundary; disabled actions retain reduced opacity. Reserve ghost buttons for compact utilities such as theme, search, close, and sidebar toggles.
- Soft: low-opacity primary fill, useful for related actions.
- Ghost: minimal chrome for navigation and utility controls.
- Success/destructive: semantic fill and text, always with a label.
- Disabled: reduced opacity, no activation, no hover glow.
- Default height: 40px; large: 48px. Compact sizes remain available for dense layouts. Coarse-pointer targets grow to at least 44px.

Use `buttonVariants()` for links with button appearance, and `Button` for actions. Do not turn navigation into a button or use a decorative tile as an unlabeled action.

### Inputs, selects, sliders, checkboxes

Fields use an inset neutral material with explicit labels. Default Input height is 44px. On small touch devices input text is at least 16px to avoid browser zoom. Invalid fields use the destructive boundary plus a useful error message. Shadcn Select components built on Base UI provide themed popups, scrolling, typeahead, and keyboard navigation. Sliders use a recessed rail and a cyan thumb with a stronger border. Checkboxes retain a native checkmark and semantic primary accent.

### Segmented controls and key pickers

A recessed track surrounds raised active items. Selected items have a border and explicit `aria-checked`. Arrow keys, Home, and End move selection. The active item is in the tab sequence; other options remain arrow-key accessible. Root pickers wrap into six columns on narrow screens.

### Navigation

The neutral sidebar holds grouped course navigation. Active pages use text tint and a position bar; hover is a quieter fill. The collapsed rail preserves accessible names. The progress card uses a lime surface and a dark next-action button. A mobile sheet provides the same navigation.

### Metrics, meters, charts

Large readouts are light weight, tabular, and paired with small descriptive labels. Filled bars use a cyan-to-green direction. Empty tracks remain visible. Charts keep labels, tooltips, and accessible summaries. Dashboard values continue to come from the existing study and practice stores; decorative numbers are not substituted for user data.

### Tables, dialogs, tooltips, skeletons

Tables use a lightly inset header, quiet row dividers, hover tint, and local horizontal scrolling. Dialogs use a raised popover surface, blurred dark backdrop, close control, focus management, and Escape handling. Tooltips retain their responsive width cap. Skeletons use muted surfaces and respect reduced motion.

### Metronome

The cyan tempo display echoes the reference's numeric tiles. A real range input controls BPM; four recessed beat indicators light in lime during playback. Playback behaviour and accessible action names are preserved. The layout stacks on narrow screens.

## Accessibility and motion

Aim for WCAG AA text contrast: 4.5:1 for normal text and 3:1 for large text; visible input boundaries and focus indicators should remain distinguishable. Use the specified foreground/background pairs. Transparency changes the effective colour, so check the final rendered combination when introducing a new tint. Pale decorative surfaces always use dark text.

Keyboard focus is a 2px outline with a 3px offset, supplemented by existing component rings. Native and Base UI semantics stay intact. Keep status labels, diagram legends, and icons rather than depending on hue alone. Layouts must remain usable at 320px and with text scaling. Touch controls have 44px minimum targets where the shared control system applies.

Motion tokens are 160ms (small feedback), 240ms (normal transitions), with `cubic-bezier(.22, 1, .36, 1)` easing. Sidebar transitions retain 300ms. Hover elevation is subtle. `prefers-reduced-motion` disables meaningful animation and transitions globally. Forced-colour mode restores explicit boundaries for key surfaces and selections.

## Theme behaviour

The existing preference model remains: follow the operating system until the user chooses a theme; store an explicit choice under `gl-theme`. A pre-paint script applies dark mode before the page is shown. Components read semantic variables rather than containing separate light and dark markup. `.light` and `.dark` also support the paired specimens on the design-system page.

## Extending the system

1. Choose an existing semantic role and component before adding a new colour or shape.
2. If a new semantic token is necessary, define its light and dark values together.
3. Keep gradients out of reading paragraphs and dense diagrams.
4. Use the spacing scale; avoid one-off spacing that merely compensates for a nearby inconsistency.
5. Test keyboard, touch, disabled, loading, empty, populated, and error states relevant to the change.
6. Check both themes at phone, tablet, and desktop widths. Confirm long labels and real music data still fit.
7. Update the live specimens and this document when changing the foundation.
