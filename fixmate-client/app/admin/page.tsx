'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800">
          Admin Workspace
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          FixMate Admin Dashboard
        </h1>

        <p className="text-slate-600 mt-2">
          Manage services, bookings, technicians, and payment records once the
          backend server is connected.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
          >
            View Services
          </Link>
          <Link
            href="/bookings"
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
          >
            View Bookings
          </Link>
        </div>
      </div>
    </section>
  );
}