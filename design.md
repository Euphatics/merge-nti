# NTI Olympiad UI/UX Design Guidelines

## 1. Design Philosophy
The NTI Olympiad platform is designed to be modern, responsive, and accessible. It focuses on a clean and professional user interface that builds trust with schools, admins, and students.

## 2. Technology Stack for Styling
- **CSS Framework**: Tailwind CSS v4
- **Component Library**: Flowbite React (for pre-built interactive components)
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
