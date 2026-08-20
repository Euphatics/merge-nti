# NTI Olympiad

A comprehensive web platform for managing and participating in the National Talent Identification (NTI) Olympiad. The platform facilitates student registrations, school management, syllabus browsing, and practice paper access.

## Architecture & Tech Stack

This project is a monorepo consisting of a modern React frontend and a Node.js/Express backend.

### Frontend
- **Framework**: React (Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Icons**: Lucide React
- **SEO**: React Helmet Async

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens) in HttpOnly cookies
- **Security**: 
  - bcryptjs for password hashing
  - express-rate-limit for DDOS protection
  - helmet for HTTP header security
  - CORS with strict origin validation
  - Data sanitization and input validation (Zod/custom logic)

## Features

- **School Panel**: Dedicated dashboard for schools to register, import students via CSV/Excel, and manage payments.
- **Admin Dashboard**: Secure control panel for administrators to manage schools, view system stats, and configure global settings.
- **Student Portal**: Access to syllabus, previous year question papers (PYQs), and marking schemes.
- **SEO Optimized**: Dynamic meta tags and schema markup for all public pages.
- **Responsive Design**: fully mobile-friendly interface across all devices.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or remote, e.g., Aiven)

### Environment Variables

**Backend (`backend/.env`)**
\`\`\`env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-key"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
\`\`\`

**Frontend (`frontend/.env`)**
\`\`\`env
VITE_API_URL="http://localhost:5000"
\`\`\`

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd olympiad
   \`\`\`

2. **Install Backend Dependencies & Setup DB:**
   \`\`\`bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   \`\`\`

3. **Install Frontend Dependencies:**
   \`\`\`bash
   cd ../frontend
   npm install
   npm run dev
   \`\`\`

## Security Best Practices Implemented

- **Authentication**: No passwords stored in plain text. Secure, HTTP-only cookies prevent XSS theft of JWTs.
- **Authorization**: Strict role-based checks (Admin vs School) on all protected routes. IDOR prevention by validating requested resources against the authenticated session.
- **Database**: Prisma ORM prevents SQL injection. Parameterized queries are used universally.
- **Rate Limiting**: Applied to login routes to mitigate brute-force attacks.
- **Content Security Policy (CSP)**: Enforced via `helmet` and meta tags to restrict resource loading.

## Deployment

The frontend is optimized for deployment on Vercel or Netlify. The backend can be deployed on Render, Railway, or Heroku.
Ensure to set `NODE_ENV="production"` and configure all environment variables appropriately in the deployment platform.
