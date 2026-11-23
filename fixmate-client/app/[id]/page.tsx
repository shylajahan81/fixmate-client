'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest, getSession } from '../lib/api';
import { AuthSession, ServiceItem, UserProfile } from '../../types/fixmate';

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? '';

  const [service, setService] = useState<ServiceItem | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const currentSession = await getSession();
        if (active) {
          setSession(currentSession);
        }

        const serviceRes: any = await apiRequest(`/api/services/${id}`);
        const serviceData =
          serviceRes?.data ?? serviceRes?.service ?? serviceRes;

        if (active) {
          setService(
            serviceData && typeof serviceData === 'object' ? serviceData : null
          );
        }

        const sessionAny = currentSession as any;
        if (sessionAny?.user?.id || sessionAny?.token) {
          try {
            const meRes: any = await apiRequest('/api/auth/me');
            const meData = meRes?.data ?? meRes?.user ?? meRes;
            if (active && meData && typeof meData === 'object') {
              setProfile(meData);
            }
          } catch {
            // Backend offline or unauthenticated
          }
        }
      } catch {
        if (active) {
          setErrorMessage(
            'Could not load service details right now. Please check if the backend server is running.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadData();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  async function handleBookService() {
    setStatusMessage(null);
    setErrorMessage(null);

    if (!session && !profile) {
      setErrorMessage('Please sign in first to book a repair service.');
      router.push('/sign-in');
      return;
    }

    setBookingLoading(true);
    try {
      await apiRequest('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: id,
        }),
      });

      setStatusMessage('Booking request submitted successfully.');
    } catch {
      setErrorMessage(
        'Unable to submit booking right now because the backend server is not connected.'
      );
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/services"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← Back to Services
        </Link>
      </div>

      {statusMessage && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
          Loading service details...
        </div>
      ) : !service ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-xl font-bold text-slate-900">Service Details</h1>
          <p className="mt-2 text-sm text-slate-600">
            Service ID: <span className="font-mono">{id || 'N/A'}</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            No live service data found yet. Once the backend API is running,
            details for this service will appear here.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBookService}
              disabled={bookingLoading}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {bookingLoading ? 'Processing...' : 'Request Booking'}
            </button>
            <Link
              href="/services"
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              All Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {service.title || (service as any).name || 'Repair Service'}
          </h1>
          {service.description && (
            <p className="mt-3 text-slate-600 leading-relaxed">
              {service.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBookService}
              disabled={bookingLoading}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {bookingLoading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}