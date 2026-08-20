# System Architecture

## 1. High-Level Overview
The NTI Olympiad platform follows a modern client-server architecture. It is structured as a monorepo containing two main parts:
1. **Frontend**: A Single Page Application (SPA) built with React.
2. **Backend**: A RESTful API built with Node.js and Express.

## 2. Frontend Architecture
- **Framework**: React 19 (bootstrapped with Vite)
- **Routing**: React Router DOM (Client-side routing)
- **State Management**: React Hooks (Context API, useState, etc.)
- **Styling**: Tailwind CSS + Flowbite React
- **Build Tool**: Vite (for fast HMR and optimized production builds)

## 3. Backend Architecture
- **Runtime**: Node.js v22
- **Framework**: Express.js
- **ORM**: Prisma Client
- **Language**: TypeScript (executed via `tsx` in development)
- **Authentication**: Stateless JWT (JSON Web Tokens)
- **Security**: Password hashing with `bcryptjs`

## 4. Database Architecture
- **Database Engine**: MySQL
- **Hosting**: Aiven Cloud
- **Schema**: Managed via Prisma (`prisma/schema.prisma`). It includes tables for `School`, `Student`, `Coordinator`, `Principal`, `Payment`, `Result`, and more.

## 5. External Integrations
- **Cloudinary**: Used for storing and serving media files, such as payment proofs and gallery images.
- **Google Apps Script**: Used as a serverless webhook/API for email automation or spreadsheet synchronization.

## 6. Request Flow
1. The **Client** (Browser) sends an HTTP request to the **Backend API**.
2. The **Express Router** intercepts the request and passes it through middleware (CORS, auth validation).
3. The **Controller** processes the business logic.
4. The **Prisma Client** communicates with the **MySQL Database** if data retrieval or mutation is required.
5. The **Controller** formats the response and sends it back to the **Client** as JSON.
