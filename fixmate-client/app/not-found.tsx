
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
        <Wrench className="w-8 h-8" />
      </div>
      <p className="text-sm font-bold text-teal-700">404 — PAGE NOT FOUND</p>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">
        This repair route is off the blueprint
      </h1>
      <p className="text-sm text-slate-600 mt-2 max-w-md">
        The service or page you are looking for does not exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
      >
        Back to Home
      </Link>
    </div>
  );
}