# System & Deployment Guide

## 1. Hosting Providers
- **Frontend**: Designed to be deployed on Vercel (`vercel.json` is included).
- **Backend**: Designed to be deployed on Render (URL: `https://olympiad-backend-yzd4.onrender.com`).
- **Database**: MySQL hosted on Aiven Cloud.
- **Media Storage**: Cloudinary.

## 2. Environment Variables

### Backend (`backend/.env`)
Required variables for the backend to function:
- `PORT` - The port the server runs on (e.g., 5000).
- `NODE_ENV` - `development` or `production`.
- `CLIENT_URL` - URL of the frontend (for CORS).
- `DATABASE_URL` - MySQL connection string.
- `JWT_TOKEN` - Secret key for signing JWTs.
- `GOOGLE_APPS_SCRIPT_URL` - Webhook URL for Apps Script integrations.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Cloudinary credentials.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` - Admin credentials.

### Frontend (`frontend/.env`)
- `VITE_API_URL` - URL of the backend API (e.g., `http://localhost:5000` or the Render URL).

## 3. Local Development Setup
1. Ensure Node.js (v18+) is installed.
2. Clone the repository.
3. In the `/backend` folder:
   - Run `npm install`
   - Create a `.env` file based on `.env.example`.
   - Run `npx prisma generate` to build the Prisma client.
   - Run `npm run dev` to start the backend.
4. In the `/frontend` folder:
   - Run `npm install`
   - Create a `.env` file with `VITE_API_URL`.
   - Run `npm run dev` to start Vite.

## 4. Production Deployment Steps
1. **Database**: Push Prisma schema to production using `npx prisma db push` or `npx prisma migrate deploy`.
2. **Backend (Render)**: Set the build command to `npm install && npx prisma generate` and the start command to the production entry point. Add all `.env` variables to Render's dashboard.
3. **Frontend (Vercel)**: Connect the Vercel project to the GitHub repo. Ensure the root directory is set to `frontend`. Add `VITE_API_URL` to Vercel's environment variables.
