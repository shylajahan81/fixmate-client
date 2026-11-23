'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';
import { BookingItem, ServiceItem } from '../../../types/fixmate';

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<ServiceItem[]>('/api/services/technician/mine'),
      apiRequest<BookingItem[]>('/api/bookings/technician'),
    ])
      .then(([srv, bkg]) => {
        setServices(Array.isArray(srv) ? srv : []);
        setBookings(Array.isArray(bkg) ? bkg : []);
      })
      .catch(() => {
        setServices([]);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalServices = services.length;
  const approvedServices = services.filter(
    (s) => s.approvalStatus === 'approved'
  ).length;
  const pendingRequests = bookings.filter(
    (b) => b.status === 'requested'
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Technician Overview
      </h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading technician metrics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Total Services
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalServices}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Approved Services
            </p>
            <p className="text-3xl font-bold text-emerald-700 mt-2">
              {approvedServices}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Pending Requests
            </p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {pendingRequests}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}