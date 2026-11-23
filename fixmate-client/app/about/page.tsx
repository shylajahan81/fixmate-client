import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-14">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800">
          About FixMate
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
          Reliable Device &amp; Home Appliance Repair Made Simple
        </h1>
        <p className="text-slate-600 mt-4 leading-relaxed">
          FixMate connects customers with verified local technicians for
          smartphones, laptops, ACs, refrigerators, TVs, washing machines, and
          electrical repairs—with transparent status tracking and payment only
          after job completion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="p-5 rounded-2xl bg-stone-50 border border-slate-200">
            <h2 className="font-semibold text-slate-900">1. Book Easily</h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Choose home visit or shop drop-off, pick your preferred date, and
              describe the issue.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-stone-50 border border-slate-200">
            <h2 className="font-semibold text-slate-900">2. Track Live Status</h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Follow every stage from requested and accepted to in-progress and
              completed.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-stone-50 border border-slate-200">
            <h2 className="font-semibold text-slate-900">3. Pay After Repair</h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Pay securely via Stripe only once the technician marks the repair
              completed.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition"
          >
            Browse Services
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Join as Technician
          </Link>
        </div>
      </div>
    </section>
  );
}