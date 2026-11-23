'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-2xl font-bold">
          !
        </div>

        <span className="inline-block mt-5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
          Payment Cancelled
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Your Payment Was Not Completed
        </h1>

        <p className="text-slate-600 mt-3 leading-relaxed">
          No charges were made. You can return to your bookings to try the
          payment again or continue browsing repair services.
        </p>

        {bookingId && (
          <p className="mt-4 text-xs text-slate-500 break-all">
            Booking Reference: <span className="font-semibold">{bookingId}</span>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/bookings"
            className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
          >
            Back to Bookings
          </Link>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-600">
          Loading...
        </section>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}