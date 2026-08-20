# NTI Olympiad UI/UX Design Guidelines

## 1. Design Philosophy
The NTI Olympiad platform is designed to be modern, responsive, and accessible. It focuses on a clean and professional user interface that builds trust with schools, admins, and students.

## 2. Technology Stack for Styling
- **CSS Framework**: Tailwind CSS v4, configured with `@theme` in `src/index.css`.
  There is no `tailwind.config.js` — v4 takes its configuration from CSS.
- **Component Library**: none. Shared primitives live in `src/components/ui/`
  and are exported from its barrel file.
  *(Flowbite React is not a dependency. It was documented here previously but
  was never installed; only a stale config folder and some orphaned CSS
  overrides remained, and both have been removed.)*
- **Icons**: Lucide React
- **Toast Notifications**: React Hot Toast

## 3. Typography
- **Primary Font**: Sans-serif stack (system fonts or a web font like Inter/Roboto).
- **Hierarchy**:
  - `h1`: Bold, text-3xl or text-4xl, used for page titles.
  - `h2`: Semi-bold, text-2xl, used for section headers.
  - `p`: Regular, text-base, used for body copy.

## 4. Color Palette
- **Primary Color**: Deep Blue/Indigo (e.g., `blue-600` to `blue-700`) - Used for primary actions, active states, and emphasis.
- **Secondary Color**: Slate/Gray (e.g., `slate-100` to `slate-800`) - Used for backgrounds, borders, and text.
- **Success/Error/Warning**: Standard Tailwind colors (`green-500`, `red-500`, `yellow-500`) for form validations and alerts.

## 5. UI Components
### Buttons
- **Primary**: Solid background with the primary color, white text, slight hover effect (e.g., darker shade or slight scale).
- **Secondary/Outline**: Transparent background, primary color border, primary color text.
- **Disabled**: Grayed out with reduced opacity, unclickable.

### Forms
- Inputs should have clear labels, placeholder text, and focus states (usually a ring with the primary color).
- Form validation errors should be clearly indicated in red below the respective input field.

### Navigation
- A responsive top navbar or sidebar for the Admin and School panels.
- Mobile navigation should use a hamburger menu that expands into a drawer or dropdown.

## 6. Layout & Responsiveness
- The layout is built using Tailwind's Flexbox and CSS Grid utilities.
- Mobile-first approach: default styles apply to mobile devices, with `sm:`, `md:`, `lg:` prefixes used to scale up the layout for tablets and desktops.
- Content is typically constrained within a `max-w-7xl` container for ultra-wide screens.

## 7. Animations & Transitions
- Use subtle transitions for interactive elements (buttons, links, form inputs).
- Class: `transition-all duration-200 ease-in-out`
- Modals and dropdowns should fade in/out smoothly.
- A global `prefers-reduced-motion` rule in `index.css` reduces every animation
  and transition to near-zero for visitors who ask for it. Do not re-enable
  motion past that rule.

## 8. States

Every view that loads data must account for four states, not one. Use the
shared components rather than inventing per-page markup:

| State | Component | Notes |
|---|---|---|
| Loading | `Skeleton` | Match the shape of the real content. |
| Error | `ErrorState` | Always offer a retry via `onRetry`. |
| Empty | `EmptyState` | Say what would appear here and how to make it appear. |
| Loaded | the page itself | |

`ErrorState` distinguishes "cannot reach the server" from a server fault —
telling someone to check their connection when the connection is fine is worse
than saying nothing.

## 9. Accessibility

- Every interactive element gets a visible focus ring. `index.css` sets a
  `:focus-visible` outline globally; do not remove it without replacing it.
- Icon-only buttons need an `aria-label`.
- Do not rely on hover alone to reveal controls — the carousel arrows, for
  example, also appear on keyboard focus.
- Decorative images use `alt=""`; meaningful images describe their content.
- Target a 4.5:1 contrast ratio for body text. The `--color-royal-600` and
  darker steps clear it against white; `royal-400` and lighter do not.

## 10. Colour usage in code

Prefer the `royal-*` theme tokens over raw hex. A number of components still
use inline hex values such as `#007BFF` and `#1F2937`; these predate the theme
and should migrate to tokens as those files are touched.
