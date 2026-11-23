'use client';

import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../../lib/api';
import { BookingItem } from '../../../types/fixmate';

const STATUS_BADGE: Record<string, string> = {
  requested: 'bg-blue-100 text-blue-800',
  accepted: 'bg-indigo-100 text-indigo-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  cancelled: 'bg-slate-200 text-slate-700',
};

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const [rejectTarget, setRejectTarget] = useState<BookingItem | null>(null);
  const [completeTarget, setCompleteTarget] = useState<BookingItem | null>(null);
  const [finalAmount, setFinalAmount] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<BookingItem[]>('/api/bookings/technician');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const changeStatus = async (
    bookingId: string,
    nextStatus: 'accepted' | 'rejected' | 'in-progress' | 'completed',
    amount?: number
  ) => {
    try {
      const body: { nextStatus: string; finalAmount?: number } = { nextStatus };
      if (nextStatus === 'completed') {
        body.finalAmount = Number(amount);
      }
      await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      toast.success(`Job status updated to ${nextStatus}`);
      setRejectTarget(null);
      setCompleteTarget(null);
      setFinalAmount('');
      loadBookings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleCompleteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;
    const numeric = Number(finalAmount);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      toast.error('Final amount must be greater than 0');
      return;
    }
    changeStatus(completeTarget._id, 'completed', numeric);
  };

  const filteredBookings =
    statusFilter === 'All'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter.toLowerCase());

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white"
        >
          <option value="All">All</option>
          <option value="Requested">Requested</option>
          <option value="Accepted">Accepted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading repair requests...</p>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600">
          No repair requests found for this filter.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-600">
              <tr>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Address &amp; Date</th>
                <th className="p-3.5">Problem</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="p-3.5 font-medium text-slate-900">
                    {job.serviceTitle}
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-800">
                      {job.customerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {job.customerPhone}
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-600">
                    <div>{job.address}</div>
                    <div className="mt-0.5">
                      {new Date(job.preferredDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-700 max-w-xs">
                    {job.problemDescription}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[job.status] || 'bg-slate-100 text-slate-700'
                        }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3.5 space-x-2 whitespace-nowrap">
                    {job.status === 'requested' && (
                      <>
                        <button
                          type="button"
                          onClick={() => changeStatus(job._id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectTarget(job)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {job.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => changeStatus(job._id, 'in-progress')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
                      >
                        Start Work
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <button
                        type="button"
                        onClick={() => {
                          setCompleteTarget(job);
                          setFinalAmount(
                            String(job.finalAmount || job.basePrice)
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                      >
                        Mark Completed
                      </button>
                    )}
                    {job.status === 'completed' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        ${job.finalAmount} · {job.paymentStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">Reject Request?</h2>
            <p className="text-sm text-slate-600 mt-2">
              Reject request for <strong>{rejectTarget.serviceTitle}</strong>?
              This is a final status.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl border text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => changeStatus(rejectTarget._id, 'rejected')}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Completed Modal */}
      {completeTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-bold text-slate-900">
              Set Final Amount (USD)
            </h2>
            <form onSubmit={handleCompleteSubmit} className="mt-4 space-y-4">
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteTarget(null)}
                  className="px-4 py-2 rounded-xl border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                >
                  Mark Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}