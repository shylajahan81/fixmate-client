# FixMate — Home Repair Service Platform

FixMate is a full-stack home repair and service booking platform where customers can browse repair services, book technicians, track job status, and complete payments, while technicians and admins manage bookings and platform operations.

## Key Features

- **Service Discovery & Filtering:** Browse repair services with server-side filtering, search, and sorting.
- **Role-Based Authentication & Access Control:** Supports customer, technician, and admin workflows with JWT / session authentication and role-based route protection.
- **Booking & Job Status Pipeline:** End-to-end service booking with structured job status updates from request to completion.
- **Stripe Payment Verification:** Secure payment flow and backend verification for completed/booked repair services.
- **Responsive UI:** Built with Next.js (`App Router`) and Tailwind CSS for desktop and mobile views.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Auth & Payments:** JWT / BetterAuth, Stripe

## Project Structure

- `fixmate-client/` — Next.js frontend application (`app/`, `sign-up`, `services`, dashboards, and API helpers)
- `fixmate-server/` — Express.js backend API (`src/config/db.js`, `src/middlewares/`, `src/routes/`, `src/seed/seedData.js`, `src/server.js`)

## Environment Variables

### Client (`fixmate-client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000