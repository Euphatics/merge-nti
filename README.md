# NTI Olympiad

A comprehensive web platform for managing and participating in the National Talent Identification (NTI) Olympiad. The platform facilitates student registrations, school management, syllabus browsing, and practice paper access.

## Documentation Reference
For detailed information about this project, please refer to the following documentation files:
- **[Architecture (architecture.md)](./architecture.md)**: Details on the tech stack, frontend/backend architecture, and database layout.
- **[System & Deployment (system.md)](./system.md)**: Environment variable configurations, hosting providers, and deployment instructions.
- **[API Contract (api-contract.md)](./api-contract.md)**: RESTful endpoints, request/response formats, and authentication requirements.
- **[UI/UX Design (design.md)](./design.md)**: Styling guidelines, Tailwind CSS configuration, and component structures.

## Tech Stack Summary
- **Frontend**: React (Vite), Tailwind CSS, React Router v7.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MySQL (via Prisma ORM).
- **Storage**: Cloudinary for media uploads.

## Getting Started

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd merged-olympiad
   \`\`\`

2. **Backend Setup:**
   \`\`\`bash
   cd backend
   npm install
   npx prisma generate
   # Ensure your .env file is set up correctly
   npm run dev
   \`\`\`

3. **Frontend Setup:**
   \`\`\`bash
   cd frontend
   npm install
   # Ensure your .env file is set up correctly
   npm run dev
   \`\`\`

## Security Best Practices
- **Authentication**: Secure JWT tokens are used for stateless authentication.
- **Database**: Prisma ORM prevents SQL injection.
- **Password Security**: Passwords are hashed using bcrypt.
