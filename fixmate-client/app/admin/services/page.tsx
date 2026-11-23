'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiRequest } from '../../lib/api';
import { ServiceItem } from '../../../types/fixmate';

const CATEGORIES = [
  'All',
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [serviceMode, setServiceMode] = useState(
    searchParams.get('serviceMode') || 'All'
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setServiceMode(searchParams.get('serviceMode') || 'All');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category && category !== 'All') params.set('category', category);
    if (serviceMode && serviceMode !== 'All') {
      params.set('serviceMode', serviceMode);
    }
    if (sort && sort !== 'newest') params.set('sort', sort);

    const qs = params.toString();
    router.replace(qs ? `/services?${qs}` : '/services', { scroll: false });

    let active = true;
    setLoading(true);

    apiRequest<ServiceItem[]>(`/api/services?${qs}`)
      .then((data: ServiceItem[]) => {
        if (active) {
          setServices(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, category, serviceMode, sort, router]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Browse Repair Services
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Search services, filter by category or mode, and sort by price or
          recency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or category..."
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select
          value={serviceMode}
          onChange={(e) => setServiceMode(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white"
        >
          <option value="All">All Modes</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Shop Drop-off">Shop Drop-off</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-slate-200/70 animate-pulse"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No services found
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            No approved services matched your current search or filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('All');
              setServiceMode('All');
              setSort('newest');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <article
              key={service._id}
              className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-teal-700">
                      {service.category}
                    </span>
                    <span className="text-slate-500">{service.serviceMode}</span>
                  </div>
                  <h2 className="font-semibold text-base text-slate-900 line-clamp-1">
                    {service.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Area: {service.serviceArea}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Tech: {service.technicianName}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  ${service.basePrice}
                </span>
                <Link
                  href={`/services/${service._id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-sm text-slate-500">
          Loading services...
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}