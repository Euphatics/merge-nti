# API Contract

All endpoints are prefixed with `/api`. Base URL is the value of the frontend's
`VITE_API_URL` (for example `https://api.ntiolympiad.in`).

## Conventions

**Content type** — requests and responses are `application/json`, except file
uploads which use `multipart/form-data`.

**Authentication** — two separate audiences, using two different mechanisms:

| Audience | Mechanism | Set by |
|---|---|---|
| School | `token` HttpOnly cookie | `POST /api/auth/login` |
| Admin | `Authorization: Bearer <jwt>` | `POST /api/admin/login` |

Both tokens are signed with `JWT_TOKEN` and expire after 12 hours. School
routes that carry a `:schoolId` verify it matches the session — a school cannot
read another school's data.

**Errors** — every non-2xx response is JSON in this shape:

```json
{ "error": "Human-readable message" }
```

Validation failures (400) add a `details` array naming each offending field:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Enter a valid email address" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

Server faults (5xx) always return the generic message `"Internal server error"`.
The underlying cause is written to the server log, never to the client.

**Pagination** — list endpoints accept `?page=` (default 1) and `?limit=`
(default 50, maximum 100) and respond with:

```json
{ "<collection>": [], "total": 0, "page": 1, "limit": 50, "totalPages": 1 }
```

**Rate limits** — `/api/*` allows 300 requests/minute per IP. `/api/auth/*`
allows 30 failed attempts per 15 minutes. `/api/admin/login` allows 10 attempts
per 15 minutes. Limits are reported via `RateLimit-*` response headers.

---

## 1. Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Liveness probe. Also available at `/api/health`. |

```json
{ "status": "ok", "uptime": 1234, "environment": "production", "timestamp": "…" }
```

## 2. Authentication — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register a school. Requires an open registration window. |
| POST | `/login` | — | Sign in with email **or** username. Sets the session cookie. |
| POST | `/logout` | — | Clears the session cookie. |
| GET | `/me` | School | The signed-in school. 401 once the session expires. |
| POST | `/verify-email` | — | Confirms the emailed verification token. |
| POST | `/forgot-password` | — | Sends a reset link. Always 200, to prevent email enumeration. |
| POST | `/reset-password` | — | Sets a new password and clears the session. |
| GET | `/registration-status` | — | Whether registration is currently open. |

**POST `/register`**
```json
{ "schoolName": "…", "email": "…", "username": "…", "password": "…" }
```
Password must be 8–128 characters with at least one letter and one digit.
Username may contain letters, numbers, dots, underscores and hyphens.
→ `201 { "message": "…" }`

**POST `/login`** — `{ "email": "<email or username>", "password": "…" }`
```json
{
  "message": "Login successful",
  "user": {
    "id": 1, "schoolName": "…", "username": "…", "email": "…",
    "status": "PENDING", "isVerified": true,
    "isProfileComplete": false, "isListLocked": false
  }
}
```
Returns 403 if the email is unverified or the school was rejected.

**GET `/me`** → `{ "user": { …same shape… } }`

**GET `/registration-status`** → `{ "isOpen": true, "startDate": "…", "endDate": "…" }`

## 3. School — `/api/schools/:schoolId`

All routes require the school session cookie, and `:schoolId` must match it.

| Method | Path | Description |
|---|---|---|
| GET | `/students` | Panel bootstrap: documents, lock state, payment status, profile. |
| POST | `/students` | Record an uploaded student list for one subject. |
| DELETE | `/students/:subjectSlug` | Remove a subject's uploaded list. |
| POST | `/complete-profile` | Save the profile wizard. |
| GET | `/payment` | This school's payment history. |
| POST | `/payment` | Submit a payment proof. |

**GET `/students`**
```json
{
  "documents": [{ "id": 1, "subjectSlug": "mathematics", "documentUrl": "…", "fileName": "…", "studentCount": 42 }],
  "isListLocked": false,
  "paymentStatus": "none",
  "paymentNotes": null,
  "schoolProfile": {
    "schoolName": "…", "schoolCode": "NTI-1", "schoolAddress": "…",
    "inchargeTeacher": "…", "inchargeContact": "…", "status": "APPROVED", "createdAt": "…"
  }
}
```
`paymentStatus` is one of `none`, `pending`, `verified`, `rejected`.

**POST `/students`** — `{ subjectSlug, documentUrl, fileName, studentCount }`.
Returns 403 once the list is locked by a verified payment.

**POST `/payment`** — `{ paymentProofUrl, amount? }`. Returns 409 if a proof is
already awaiting review.

## 4. Admin — `/api/admin`

`POST /login` is public; everything else requires the admin Bearer token.

| Method | Path | Description |
|---|---|---|
| POST | `/login` | `{ username, password }` → `{ token }` |
| GET | `/stats` | Dashboard totals. |
| GET | `/schools` | List schools. `?search=` `?status=` `?page=` `?limit=` |
| GET | `/schools/:id` | One school with coordinator, principal, students, payments. |
| PATCH | `/schools/:id/status` | `{ status: "APPROVED" \| "REJECTED" }` |
| DELETE | `/schools/:id` | Delete a school and all its related records. |
| GET | `/students` | All students. `?search=` `?subjectSlug=` |
| GET | `/payments` | All payments with school details. |
| POST | `/payments/:paymentId/verify` | `{ status: "VERIFIED" \| "REJECTED", adminNotes? }` |
| POST | `/results` | `{ subjectSlug, classSlug, year, resultUrl }` |
| DELETE | `/results/:id` | Remove a result. |
| POST | `/pyqs` | `{ subjectSlug, classSlug, year, type, paperUrl, publicId? }` |
| DELETE | `/pyqs/:id` | Remove a paper and its stored file. |
| GET | `/registration-window` | Current registration window. |
| PUT | `/registration-window` | `{ startDate, endDate }` (ISO dates). |
| POST | `/gallery` | `multipart/form-data`: `file`, `name`, `school`, `className`. |
| DELETE | `/gallery/:id` | Remove a photo and its stored file. |

**GET `/stats`**
```json
{ "totalSchools": 0, "totalStudents": 0, "pendingApprovals": 0, "verifiedSchools": 0, "pendingPayments": 0 }
```

**POST `/payments/:paymentId/verify`** — verifying also locks that school's
student list; rejecting unlocks it. Both happen in one transaction.

**POST `/pyqs`** — `type` is `"Question Paper"`, `"Answer Key"` or `"Solution"`.
Re-posting the same subject + class + year + type replaces the existing record
rather than creating a duplicate.

## 5. Uploads — `/api/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/upload` | School cookie **or** admin Bearer | Store a file, return its URL. |

`multipart/form-data` with a single `file` field. Optional `?folder=` — one of
`olympiad/payment-proofs` (default), `olympiad/student-lists`,
`olympiad/results`, `olympiad/pyqs`, `olympiad/gallery`. An unrecognised folder
is a 400.

Accepted: JPEG, PNG, WebP, GIF, PDF, Word, Excel, CSV. Maximum 15 MB —
exceeding it returns 413.

```json
{ "message": "File uploaded successfully", "url": "https://res.cloudinary.com/…", "publicId": "…", "format": "pdf", "bytes": 12345 }
```

Store `publicId` alongside the URL: it is what lets a later delete remove the
stored file rather than orphaning it.

## 6. Public read endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/results` | Published results. `?subjectSlug=` `?classSlug=` `?year=` |
| GET | `/api/pyqs` | Previous-year papers. Same filters. |
| GET | `/api/gallery` | Gallery photos. |

**GET `/api/pyqs`** → paginated, with `type` returned as its display label:
```json
{ "pyqs": [{ "id": 1, "subjectSlug": "mathematics", "classSlug": "class-5", "year": 2025, "type": "Question Paper", "paperUrl": "…", "createdAt": "…" }], "total": 1, "page": 1, "limit": 50, "totalPages": 1 }
```

**GET `/api/gallery`** → a bare array. Image URLs are absolute Cloudinary URLs;
do not prefix them with the API base.
