# NTI Olympiad – UI Component Library

A set of reusable UI primitives extracted from repeated Tailwind patterns across the frontend. These components **do not alter visual appearance** — they are abstractions over the exact Tailwind classes already in use.

---

## Import

All components can be imported from the barrel file:

```js
import { Button, Card, Breadcrumb, PageContainer, Input, TextArea, SectionHeading } from '../../components/ui';
```

---

## Components

### `<PageContainer>`

Applies the standard site-wide responsive horizontal padding.

```jsx
<PageContainer className="py-8">
  {/* page content */}
</PageContainer>
```

| Prop        | Type   | Default | Description                      |
|-------------|--------|---------|----------------------------------|
| `className` | string | `''`    | Extra Tailwind classes to append |
| `children`  | node   | —       | Page content                     |

---

### `<Breadcrumb>`

Renders the site-wide blue-tinted breadcrumb bar. The **last item** is always rendered as plain text (current page). All others become clickable links.

```jsx
<Breadcrumb items={[
  { label: 'Home', path: '/' },
  { label: 'Syllabus', path: '/syllabus-pyqs' },
  { label: 'Mathematics Class 1' }   // no path = current page
]} />
```

| Prop    | Type  | Default | Description                                  |
|---------|-------|---------|----------------------------------------------|
| `items` | array | `[]`    | `{ label: string, path?: string }[]` |

---

### `<Button>`

Reusable button with four visual variants matching all existing codebase button patterns.

```jsx
<Button variant="primary" type="submit" onClick={handleSubmit}>
  Send Message
</Button>

<Button variant="secondary" onClick={handleClick}>
  View Marking Scheme
</Button>

<Button variant="ghost">
  NMO Syllabus
</Button>
```

| Prop        | Type   | Default     | Description                                                         |
|-------------|--------|-------------|---------------------------------------------------------------------|
| `variant`   | string | `'primary'` | `'primary'` \| `'secondary'` \| `'outline'` \| `'ghost'`           |
| `type`      | string | `'button'`  | HTML button type                                                    |
| `className` | string | `''`        | Extra Tailwind classes                                              |
| `children`  | node   | —           | Button label                                                        |
| `...rest`   | any    | —           | Any other native button props (`onClick`, `disabled`, `id`, etc.)  |

**Variants:**
- `primary` — dark navy `#1E3A8A` bg, white text (Contact form submit)
- `secondary` — gray bg, gray text, border (sidebar action buttons)
- `outline` — transparent bg, blue border and text
- `ghost` — no bg/border, blue text (link-style buttons)

---

### `<Card>`

A bordered container box used in sidebars and content panels.

```jsx
<Card className="p-5">
  <nav>...</nav>
</Card>
```

| Prop        | Type   | Default | Description          |
|-------------|--------|---------|----------------------|
| `className` | string | `''`    | Extra Tailwind classes |
| `children`  | node   | —       | Card content         |

---

### `<Input>`

Standardized text input with the site-wide focus ring styling.

```jsx
<Input
  id="contact-name"
  type="text"
  name="name"
  placeholder="Name"
  required
  style={{ borderColor: '#E5E7EB' }}
/>
```

| Prop        | Type   | Default | Description                        |
|-------------|--------|---------|------------------------------------|
| `className` | string | `''`    | Extra Tailwind classes             |
| `style`     | object | —       | Inline styles (e.g. borderColor)   |
| `...rest`   | any    | —       | Any native `<input>` props         |

---

### `<TextArea>`

Standardized textarea with identical base styling to `<Input>`.

```jsx
<TextArea
  id="contact-message"
  name="message"
  placeholder="Your Message"
  rows={6}
  className="resize-y custom-scroll"
  style={{ borderColor: '#E5E7EB', minHeight: '120px' }}
/>
```

| Prop        | Type   | Default | Description                        |
|-------------|--------|---------|------------------------------------|
| `rows`      | number | `4`     | Visible text rows                  |
| `className` | string | `''`    | Extra Tailwind classes             |
| `style`     | object | —       | Inline styles                      |
| `...rest`   | any    | —       | Any native `<textarea>` props      |

---

### `<SectionHeading>`

Typography component for page and section headings.

```jsx
{/* Page title */}
<SectionHeading level="h1">
  Level 1 Exam Pattern and Marking Scheme
</SectionHeading>

{/* Rankers list heading */}
<SectionHeading level="h2">
  Subject Rankers
</SectionHeading>

{/* Section heading inside syllabus page */}
<SectionHeading level="h3">
  About the Exam
</SectionHeading>
```

| Prop        | Type   | Default | Description                          |
|-------------|--------|---------|--------------------------------------|
| `level`     | string | `'h1'`  | `'h1'` \| `'h2'` \| `'h3'`          |
| `className` | string | `''`    | Extra Tailwind classes               |
| `children`  | node   | —       | Heading text                         |

**Level Typography:**
- `h1` — `text-2xl lg:text-[28px] font-normal text-[#333]`
- `h2` — `text-3xl sm:text-4xl text-gray-900 font-semibold`
- `h3` — `text-[32px] font-bold text-[#28589c]`

---

## Design Decisions

- **No normalization**: These components preserve exact existing Tailwind classes. Visual design standardization is a future phase.
- **Minimal API**: Each component accepts `className` and `...rest` to remain fully composable.
- **No new dependencies**: Zero additional npm packages required.
