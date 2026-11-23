'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { BookingItem } from '../../types/fixmate';

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<BookingItem[]>('/api/bookings/my')
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) =>
    ['requested', 'accepted', 'in-progress'].includes(b.status)
  ).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Customer Overview
      </h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Total Requests
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalRequests}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Active Jobs
            </p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {activeJobs}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Completed Jobs
            </p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">
              {completedJobs}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}