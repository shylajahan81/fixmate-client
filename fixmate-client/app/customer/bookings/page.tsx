'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiRequest } from '../../lib/api';
import { BookingItem } from '../../../types/fixmate';

const STATUS_STYLE: Record<string, string> = {
  requested: 'bg-blue-100 text-blue-800',
  accepted: 'bg-indigo-100 text-indigo-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  cancelled: 'bg-slate-200 text-slate-700',
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<BookingItem | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<BookingItem[]>('/api/bookings/my');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      await apiRequest(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: 'PATCH',
      });
      toast.success('Booking cancelled');
      setCancelTarget(null);
      loadBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const res = await apiRequest<{ url?: string }>(
        '/api/payments/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify({ bookingId }),
        }
      );
      if (res?.url) {
        window.location.href = res.url;
      } else {
        throw new Error('Stripe checkout URL missing');
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not start Stripe checkout'
      );
      setPayingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Bookings</h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No repair bookings yet
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse verified services and submit your first repair request.
          </p>
          <Link
            href="/services"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-600">
              <tr>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Technician</th>
                <th className="p-3.5">Preferred Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const amount =
                  b.status === 'completed' ? b.finalAmount : b.basePrice;
                const canPay =
                  b.status === 'completed' && b.paymentStatus === 'unpaid';

                return (
                  <tr
                    key={b._id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.serviceImage}
                          alt={b.serviceTitle}
                          className="w-11 h-11 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-slate-900">
                          {b.serviceTitle}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">{b.technicianName}</td>
                    <td className="p-3.5 text-slate-600">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      ${amount}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[b.status] || 'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${b.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 space-x-2 whitespace-nowrap">
                      {b.status === 'requested' && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(b)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100"
                        >
                          Cancel
                        </button>
                      )}
                      {canPay && (
                        <button
                          type="button"
                          disabled={payingId === b._id}
                          onClick={() => handlePayNow(b._id)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 disabled:opacity-60"
                        >
                          {payingId === b._id ? 'Redirecting...' : 'Pay Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">
              Cancel Repair Request?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to cancel{' '}
              <strong>{cancelTarget.serviceTitle}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}