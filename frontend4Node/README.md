# Code2Deploy V2.0 - Modern SaaS Gold Standard

This project has been ruthlessly refactored to the highest industry standards for a modern SaaS platform.

## 🥇 The Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript, Tailwind CSS, Framer Motion)
- **Backend**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Supabase Auth (JWT Validation)
- **Payments**: Multi-gateway support (Stripe & Paystack)
- **Storage**: Cloudinary (Image/Video Management)
- **Deployment**: Render (Auto-deploy blueprints)

## 📁 Structure

- `web/`: Next.js frontend application.
- `api/`: NestJS backend API.
- `prisma/`: Database schema and migrations.
- `render.yaml`: Infrastructure as Code for production deployment.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL instance (or Docker)
- Supabase account
- Cloudinary account

### Installation

1. **Backend**:
   ```bash
   cd api
   npm install
   # Update .env with your credentials
   npx prisma generate
   npm run start:dev
   ```

2. **Frontend**:
   ```bash
   cd web
   npm install
   # Update .env.local
   npm run dev
   ```

## 🔒 Security
The backend uses Supabase JWT validation to ensure all protected routes are secure. Roles (Student, Instructor, Admin) are managed via the `Profile` model in the PostgreSQL database.

## 💳 Payments
Integrated with Stripe for international payments and Paystack for regional (African) markets.
