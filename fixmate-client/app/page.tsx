import Link from 'next/link';
import { ShieldCheck, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../types/fixmate';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const STEPS = [
  {
    step: '01',
    title: 'Find a Service',
    desc: 'Browse verified repair services by device, area, or service mode.',
  },
  {
    step: '02',
    title: 'Send a Request',
    desc: 'Share your address, preferred date, and device issue in minutes.',
  },
  {
    step: '03',
    title: 'Technician Fixes It',
    desc: 'Track every stage from accepted to in-progress and completed.',
  },
  {
    step: '04',
    title: 'Pay After Completion',
    desc: 'Pay securely via Stripe only once your repair is completed.',
  },
];

async function getFeaturedServices(): Promise<ServiceItem[]> {
  if (!API_URL) return [];
  try {
    const res = await fetch(`${API_URL}/api/services?sort=newest`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredServices = await getFeaturedServices();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-semibold mb-4">
              Pay Only After Repair Is Completed
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Broken Device? Get It Fixed by Verified Technicians
            </h1>
            <p className="text-slate-300 mt-4 text-base sm:text-lg max-w-xl">
              From smartphone screens to AC and refrigerator servicing, book
              trusted local technicians and follow your repair step by step.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-semibold text-sm hover:bg-amber-300 transition"
              >
                Explore Repair Services
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition"
              >
                Join as Technician
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <img
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80"
              alt="Technician repairing electronic hardware"
              className="w-full h-72 sm:h-80 object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* 6 Featured Services */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Repair Services
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Latest approved services ready for booking.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            View All →
          </Link>
        </div>

        {featuredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-slate-600 text-sm">
              Featured services will appear here once approved services are
              available from the server.
            </p>
            <Link
              href="/services"
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-medium"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <article
                key={service._id}
                className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-teal-700">
                        {service.category}
                      </span>
                      <span className="text-slate-500">
                        {service.serviceMode}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Technician: {service.technicianName}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">
                      Starting at
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      ${service.basePrice}
                    </span>
                  </div>
                  <Link
                    href={`/services/${service._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Extra Section 1: How FixMate Works */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            How FixMate Works
          </h2>
          <p className="text-sm text-slate-600 text-center mt-2 max-w-xl mx-auto">
            A simple four-step workflow designed for clarity and peace of mind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-stone-50 border border-slate-200"
              >
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  STEP {item.step}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mt-4">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 2: Popular Categories & Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Popular Repair Categories
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Click any category to view matching approved services.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/services?category=${encodeURIComponent(cat)}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 text-center text-sm font-semibold text-slate-800 transition"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <ShieldCheck className="w-6 h-6 text-teal-700" />
            <h3 className="font-semibold text-slate-900 mt-3">
              Admin-Approved Services
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Every technician listing is reviewed before going live on the
              platform.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <Clock className="w-6 h-6 text-teal-700" />
            <h3 className="font-semibold text-slate-900 mt-3">
              Transparent Job Stages
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Follow your job across requested, accepted, in-progress, and
              completed stages.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <CreditCard className="w-6 h-6 text-teal-700" />
            <h3 className="font-semibold text-slate-900 mt-3">
              Pay Only After Completion
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Stripe checkout unlocks only once the technician completes your
              repair.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}