# EasyresPlus

**Analyze, review, and optimize your resume to stand out in the job market.**

EasyresPlus is a comprehensive platform designed to help job seekers improve their application success rates. It combines AI-powered analysis, smart optimization tools, and application tracking into a seamless user experience. By leveraging advanced AI, EasyresPlus provides instant feedback on resumes, checks for ATS compatibility, and helps users tailor their content to specific job descriptions.

## Features

- **AI-Powered Analysis**: Instant feedback on resumes using an advanced AI engine. Checks for ATS compatibility, content quality, and formatting issues.
- **Smart Optimization**: Tools to automatically optimize keywords and formatting to better match job descriptions.
- **Performance Tracking**: Track application success rates and correlate resume improvements with interview outcomes.
- **Resume Management**: Securely upload, store, and manage multiple versions of resumes and cover letters.
- **Cover Letter Assistant**: AI-assisted generation of tailored cover letters for specific job applications.
- **AI Chat Assistant**: Interactive AI chat to help refine application materials and answer career-related questions.
- **Secure Authentication**: Robust user authentication system.

## Tech Stack

This project is a monorepo built with modern web technologies, prioritizing type safety, performance, and developer experience.

### Core
- **Runtime & Manager**: [Bun](https://bun.sh)
- **Monorepo Orchestration**: [TurboRepo](https://turbo.build)
- **Language**: TypeScript

### Frontend (Client)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Component Library**: HeroUI
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **PDF Handling**: React PDF Viewer, PDF.js
- **State Management**: Nuqs (URL state), React Query
- **Error Tracking**: Sentry

### Backend (Server)
- **Framework**: Hono
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: Better Auth
- **Email**: Nodemailer / Resend
- **Validation**: Zod
- **Storage**: Cloudflare R2 / AWS S3 compatible object storage

### AI Services
- **Service**: External Python Microservice (integrated via REST API)

### Shared
- **Shared Library**: Common TypeScript definitions, utilities, and Zod validators shared between client and server to ensure type safety across the stack.

## Project Structure

The project follows a workspace-based monorepo structure:

- `client/`: The React frontend application.
- `server/`: The Hono backend API handling business logic, data persistence, and authentication.
- `shared/`: Shared code including TypeScript types, interface definitions, and environment validators.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.2.4 or later)
- PostgreSQL database
- Cloudflare R2 or AWS S3 compatible storage buckets

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Environment Variables

The application requires several environment variables to function. You should configure these in `.env` files for the respective workspaces.

**Core & Database:**
- `DATABASE_URL`: Connection string for PostgreSQL.
- `PORT`: Server port.
- `APP_URL`: The URL of the frontend application.
- `CORS_ORIGINS`: Allowed CORS origins.

**Authentication & Security:**
- `BETTER_AUTH_SECRET`: Secret key for authentication.
- `ACCESS_TOKEN`: Internal access token.
- `COOKIE_DOMAIN`: Domain for cookies.
- `COOKIE_NAME`: Name of the session cookie.
- `COOKIE_SAMESITE`: SameSite policy (`lax`, `strict`, `none`).

**Storage (R2/S3):**
- `R2_ACCESS_KEY`: Storage access key ID.
- `R2_SECRET_ACCESS_KEY`: Storage secret access key.
- `R2_ENDPOINT`: Storage endpoint URL.
- `R2_BUCKET_NAME`: Name of the bucket (e.g., for avatars).
- `R2_ACCOUNT_ID`: Cloudflare account ID.
- `R2_TOKEN`: API token for R2.

**AI & External Services:**
- `VITE_PY_URL`: URL for the external Python AI service (Client-side).
- `RESEND_API_KEY`: API key for email service (Production).
- `MAIL_FROM`: Sender email address (Production).
- `SMTP_PORT`: SMTP port for emails.

### Development

You can run the entire stack in development mode using TurboRepo:

```bash
bun run dev
```

Or run individual workspaces:

```bash
# Run Client
bun run dev:client

# Run Server
bun run dev:server
```

### Building

To build the project for production:

```bash
bun run build
```

## License

MIT
