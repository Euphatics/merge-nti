# API Contract

This document outlines the standard API routes for the NTI Olympiad backend. All endpoints are prefixed with `/api`.

## 1. Authentication (`/api/auth`)
- `POST /login` - Authenticates a school or admin and returns a JWT token.
- `POST /register` - Registers a new school (pending approval).
- `POST /forgot-password` - Initiates the password reset flow.
- `POST /reset-password` - Resets the password using a valid token.
- `GET /me` - Fetches the currently authenticated user's profile.

## 2. Admin (`/api/admin`)
*(Requires Admin JWT token)*
- `GET /schools` - Retrieves a list of all registered schools.
- `PUT /schools/:id/status` - Approves or rejects a school registration.
- `GET /stats` - Retrieves platform statistics (total schools, students, etc.).

## 3. Students (`/api/student`)
*(Requires School JWT token)*
- `GET /` - Fetches all students registered by the school.
- `POST /` - Registers a new student.
- `PUT /:id` - Updates a student's details.
- `DELETE /:id` - Removes a student.

## 4. Payments (`/api/payment`)
*(Requires School JWT token)*
- `GET /` - Retrieves the school's payment history.
- `POST /` - Submits a new payment proof (links to Cloudinary URL).

## 5. Uploads (`/api/upload`)
- `POST /` - Uploads a file (e.g., payment receipt, gallery image) to Cloudinary and returns the URL.

## 6. Gallery (`/api/gallery`)
- `GET /` - Retrieves public gallery images.
- `POST /` - (Admin only) Adds a new image to the gallery.

## 7. Results (`/api/result`)
- `GET /` - Fetches the latest olympiad results/links.

---

### Standard Response Format
**Success (200/201)**
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

**Error (4xx/5xx)**
\`\`\`json
{
  "success": false,
  "error": "Detailed error message here"
}
\`\`\`
