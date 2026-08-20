# NTI Olympiad

A web platform for running the National Talent Identification (NTI) Olympiad:
school registration, student list submission, payment verification, syllabus
and previous-year papers, results, and an admin panel to administer it all.

## Documentation

| Document | Contents |
|---|---|
| [architecture.md](./architecture.md) | Tech stack, module layout, data model, request flow |
| [system.md](./system.md) | Environment variables, local setup, Hostinger deployment |
| [api-contract.md](./api-contract.md) | Every endpoint, auth, error and pagination shape |
| [design.md](./design.md) | Styling, component conventions, states, accessibility |

## Tech stack

- **Frontend** — React 19, Vite, Tailwind CSS v4, React Router v7
- **Backend** — Node.js 20+, Express 5, TypeScript, Zod, Prisma
- **Database** — MySQL
- **Storage** — Cloudinary
- **Email** — Google Apps Script webhook

## Quick start

Requires Node.js 20 or newer.

```bash
git clone <repository-url>
cd merged-olympiad
npm install

# Backend configuration
cp backend/.env.example backend/.env
cd backend && npm run hash-password -- "choose-an-admin-password"
# paste the printed ADMIN_PASSWORD_HASH and JWT_TOKEN into backend/.env,
# then fill in DATABASE_URL and the CLOUDINARY_* values
cd ..

npm run db:deploy    # apply database migrations
npm run dev          # backend on :5000, frontend on :5173
```

`GOOGLE_APPS_SCRIPT_URL` can be left empty locally — verification links are
written to the server log instead of being emailed, so registration still works
end to end.

## Repository layout

```
.
├── backend/                Express API
│   ├── prisma/             Schema and migrations
│   ├── scripts/            hash-password helper
│   ├── src/
│   │   ├── app.ts          Builds the Express app (testable, no listen)
│   │   ├── index.ts        Boot, DB connect, graceful shutdown
│   │   ├── config/         env, logger, prisma, cloudinary, cookies
│   │   ├── controllers/    Business logic
│   │   ├── middleware/     auth, validation, uploads, error handling
│   │   ├── routes/         URL shape
│   │   └── validation/     Zod schemas
│   └── test/               Node test runner suites
├── frontend/               React SPA
│   ├── public/             Static assets
│   ├── src/
│   │   ├── components/ui/  Shared primitives
│   │   ├── config/         API client, routes, subjects
│   │   ├── hooks/          useAsyncData, useSchoolSession, form hooks
│   │   └── pages/          Route components
│   └── vite.config.js      Build config; also generates dist/.htaccess
└── .github/workflows/      CI
```

## Scripts

Run from the repository root.

| Command | Does |
|---|---|
| `npm run dev` | Both servers with reload |
| `npm run verify` | Typecheck, lint, test, build — exactly what CI runs |
| `npm run build` | Production build of both workspaces |
| `npm test` | Backend test suite |
| `npm run lint` | Frontend ESLint |
| `npm run db:migrate` | Create a migration from schema changes |
| `npm run db:deploy` | Apply pending migrations |
| `npm run db:studio` | Browse the database |

Run `npm run verify` before pushing; CI runs the same pipeline.

## Security notes

- Passwords are hashed with bcrypt. The admin password exists only as a hash in
  the environment.
- Schools authenticate with an HttpOnly cookie; admins with a Bearer token.
  Both expire after 12 hours.
- `JWT_TOKEN` must be at least 32 characters — the server refuses to start
  otherwise. Anyone who recovers this secret can mint an admin token.
- Every request body, route parameter and query string is validated by Zod
  before a controller sees it.
- Server faults return a generic message; details stay in the log.
- Prisma parameterises all queries.
- The SPA is served with a Content-Security-Policy that has no
  `script-src 'unsafe-inline'`.

## Deployment

See [system.md](./system.md). In short: the SPA is static files in
`public_html`, and the API runs as a Hostinger Node.js app — which requires a
**Business or Cloud plan**, as Premium and Single plans cannot run Node.
