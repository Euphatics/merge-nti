# System Architecture

## 1. High-Level Overview

An npm-workspace monorepo with two deployable units:

1. **Frontend** — a React single-page application, built by Vite into static
   files. No server runtime.
2. **Backend** — a REST API on Node.js and Express, compiled from TypeScript.

They are deployed to different origins (`ntiolympiad.in` and
`api.ntiolympiad.in`), so CORS and cookie attributes are configuration, not
constants. See `system.md`.

```
Browser ──► ntiolympiad.in        (static SPA, Apache/LiteSpeed)
   │
   └──────► api.ntiolympiad.in    (Node/Express)
                  │
                  ├──► MySQL       (Prisma)
                  ├──► Cloudinary  (all uploaded files)
                  └──► Apps Script (transactional email)
```

## 2. Frontend

- **Framework**: React 19, bootstrapped with Vite
- **Routing**: React Router v7, client-side. Every route falls back to
  `index.html` via the generated `.htaccess`.
- **State**: React hooks. No global store — server data is fetched per page
  through `useAsyncData`, and session state through `useSchoolSession`.
- **Styling**: Tailwind CSS v4, configured in `src/index.css` via `@theme`.
  There is no `tailwind.config.js`, and Flowbite React is **not** used.
- **Icons**: Lucide React. **Toasts**: React Hot Toast.

Key modules:

| Path | Responsibility |
|---|---|
| `src/config/api.js` | Base URL, `api`/`adminApi` clients, error normalisation, 401 broadcast |
| `src/hooks/useAsyncData.js` | Fetch-on-mount with loading, error and retry |
| `src/hooks/useSchoolSession.js` | Verifies the session against `GET /api/auth/me` |
| `src/components/ui/` | Shared primitives, including `ErrorState` / `EmptyState` |
| `src/data/syllabusData.js` | Static syllabus content, code-split into its own chunk |

Routes are lazy-loaded, and vendor code is split into `react`, `router`,
`icons` and `sheets` chunks by `vite.config.js`.

## 3. Backend

- **Runtime**: Node.js 20+ (22 in CI)
- **Framework**: Express 5, ES modules
- **Language**: TypeScript, strict, with `exactOptionalPropertyTypes`
- **ORM**: Prisma
- **Auth**: JWT — HttpOnly cookie for schools, Bearer token for admins
- **Passwords**: bcrypt

Layering — a request passes through each stage in order:

```
app.ts
  ├─ trust proxy, pino-http, helmet, compression, CORS
  ├─ cookie-parser, body parsers
  ├─ rate limiters
  ├─ routes/         URL shape only
  │    └─ validate({ body, params, query })   Zod — rejects bad input at the edge
  │         └─ controllers/                   business logic; throws ApiError
  │              └─ config/prisma             database
  └─ notFoundHandler → errorHandler           always JSON, never HTML
```

| Path | Responsibility |
|---|---|
| `src/app.ts` | Builds the Express app. No listening or DB connection — makes it testable. |
| `src/index.ts` | Connects Prisma, listens, handles graceful shutdown. |
| `src/config/env.ts` | Zod-validated environment. Fails fast, listing every problem. |
| `src/config/cookies.ts` | Session cookie attributes, driven by environment. |
| `src/config/cloudinary.ts` | Folder allowlist, upload and delete helpers. |
| `src/middleware/error.middleware.ts` | Maps Zod / Multer / JWT / Prisma errors to statuses. |
| `src/validation/` | Zod schemas, bounded to match the column widths in the schema. |
| `src/utils/ApiError.ts` | Errors carrying an HTTP status; anything else becomes a 500. |

Errors that are not an `ApiError` are treated as bugs: logged in full, reported
to the client as a generic 500. That is what keeps SQL fragments and file paths
out of the browser.

## 4. Database

- **Engine**: MySQL
- **Access**: Prisma Client
- **Schema**: `backend/prisma/schema.prisma`
- **Migrations**: `backend/prisma/migrations/` — applied with
  `prisma migrate deploy`. Never use `db push` against production.

Models:

| Model | Table | Notes |
|---|---|---|
| `School` | `schools` | The account. Owns everything below. |
| `Coordinator` | `coordinators` | One per school. |
| `Principal` | `principals` | One per school. |
| `ParticipationDetail` | `participation_details` | Subjects, classes, per-band counts. |
| `Student` | `students` | Individual entries. |
| `StudentDocument` | `student_documents` | Uploaded list per school + subject. |
| `Payment` | `payments` | Proof and verification state. |
| `Result` | `results` | Published result sheets. |
| `Pyq` | `pyqs` | Previous-year papers, keyed by subject + class + year + type. |
| `GalleryImage` | `gallery_images` | Event photos. |
| `RegistrationWindow` | `registration_windows` | Opens and closes registration. |
| `Subject` | `subjects` | Reference data. |

Enums: `RegistrationStatus` (PENDING/APPROVED/REJECTED), `PaymentStatus`
(PENDING/VERIFIED/REJECTED), `PyqType` (QUESTION_PAPER/ANSWER_KEY/SOLUTION).

All child records cascade on school deletion.

## 5. External services

**Cloudinary** — stores every uploaded file: payment proofs, student lists,
result sheets, PYQ papers and gallery photos. Uploads stream straight from
memory; nothing is written to the application's own filesystem, because that
filesystem does not survive a redeploy.

Each record keeps the Cloudinary `publicId` next to its URL so a delete removes
the file as well as the row.

**Google Apps Script** — a webhook that sends verification and password-reset
emails. Optional: with `GOOGLE_APPS_SCRIPT_URL` unset the link is written to the
log instead, so local registration still works. Calls are made with a 10-second
timeout and never block the HTTP response.

## 6. Request flow

1. The browser sends a request, with the session cookie or a Bearer token.
2. CORS checks the `Origin` against the configured allowlist.
3. The rate limiter buckets by client IP — correct only because `trust proxy`
   is set, otherwise every visitor shares the proxy's bucket.
4. Auth middleware verifies the token and, for school routes, that `:schoolId`
   matches it.
5. Zod parses and coerces the body, params and query. Anything malformed is a
   400 that names the field.
6. The controller runs the business logic and reads or writes through Prisma.
7. The response is JSON. Any thrown error lands in the error handler, which
   decides the status and hides internals in production.
