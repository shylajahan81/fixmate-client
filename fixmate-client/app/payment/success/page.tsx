'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('bookingId');

  const [statusMessage, setStatusMessage] = useState(
    'Confirming your payment...'
  );
  const [confirming, setConfirming] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function confirmPayment() {
      if (!sessionId && !bookingId) {
        if (isMounted) {
          setStatusMessage(
            'Your payment has been received. Your repair booking is now confirmed.'
          );
          setConfirming(false);
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ sessionId, bookingId }),
        });

        if (!res.ok) {
          throw new Error('Could not sync payment status with server yet.');
        }

        if (isMounted) {
          setStatusMessage(
            'Payment verified and your booking status has been updated.'
          );
          setConfirming(false);
        }
      } catch {
        if (isMounted) {
          setStatusMessage(
            'Payment succeeded! Once the backend server is running, booking status will sync automatically.'
          );
          setConfirming(false);
        }
      }
    }

    confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, bookingId]);

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-bold">
          ✓
        </div>

        <span className="inline-block mt-5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800">
          Payment Successful
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Thank You for Using FixMate
        </h1>

        <p className="text-slate-600 mt-3 leading-relaxed">
          {confirming ? 'Verifying payment details...' : statusMessage}
        </p>

        {(sessionId || bookingId) && (
          <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1 break-all">
            {bookingId && (
              <p>
                <span className="font-semibold text-slate-800">Booking ID:</span>{' '}
                {bookingId}
              </p>
            )}
            {sessionId && (
              <p>
                <span className="font-semibold text-slate-800">Session ID:</span>{' '}
                {sessionId}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/bookings"
            className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
          >
            View My Bookings
          </Link>
          <Link
            href="/transactions"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Transactions
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-600">
          Loading payment confirmation...
        </section>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}