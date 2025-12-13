# AviatorTutor

A full-stack SaaS aviation training platform built with Next.js 14 (App Router), TypeScript, TailwindCSS, Prisma, PostgreSQL, and NextAuth.

## Features

- **Multi-role system**: Student, Instructor, Admin, Super Admin, Owner
- **Dashboard per role**: Tailored UI with role-specific navigation
- **Class management**: Create, edit, publish classes (1-on-1, Group, Chat)
- **Booking system**: Book sessions with instructors
- **Zoom integration**: Live video sessions (stub ready for API)
- **Payment integration**: Stripe checkout (Flutterwave stub ready)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd aviatortutor

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed test data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Test Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | password123 |
| Instructor | instructor@test.com | password123 |
| Admin | admin@test.com | password123 |
| Super Admin | superadmin@test.com | password123 |
| Owner | owner@test.com | password123 |

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aviatortutor"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Zoom Integration (Optional)
ZOOM_ACCOUNT_ID=""
ZOOM_CLIENT_ID=""
ZOOM_CLIENT_SECRET=""

# Payment - Stripe (Default Provider)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Payment - Flutterwave (Alternative)
FLW_PUBLIC_KEY=""
FLW_SECRET_KEY=""
FLW_ENCRYPTION_KEY=""

# Payment Provider Selection
PAYMENT_PROVIDER="stripe"  # or "flutterwave"
```

## Project Structure

```
src/
├── app/
│   ├── (public)/      # Public pages (home, classes, instructors)
│   ├── student/       # Student dashboard
│   ├── instructor/    # Instructor dashboard
│   ├── admin/         # Admin dashboard
│   ├── super-admin/   # Super Admin dashboard
│   ├── owner/         # Owner dashboard
│   └── api/           # API routes
├── components/
│   ├── layout/        # DashboardShell, Header, Footer
│   ├── ui/            # Reusable UI components
│   └── auth/          # Auth modal, forms
└── lib/
    ├── auth.ts        # NextAuth configuration
    ├── prisma.ts      # Prisma client
    ├── zoom.ts        # Zoom integration service
    └── payments.ts    # Payment provider abstraction
```

## Key Technologies

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Prisma** - ORM
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication
- **Stripe** - Payments
- **Framer Motion** - Animations

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Deployment

Deploy on Vercel or any Node.js hosting. Ensure all environment variables are configured.

## License

MIT
