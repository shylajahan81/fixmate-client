import Link from 'next/link';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold text-white"
          >
            <span className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </span>
            <span>FixMate</span>
          </Link>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Trusted device and home appliance repair with transparent job
            tracking and payment only after completion.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-teal-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-teal-400">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-teal-400">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
            Popular Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/services?category=Smartphone"
                className="hover:text-teal-400"
              >
                Smartphone
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=Laptop%20%26%20PC"
                className="hover:text-teal-400"
              >
                Laptop &amp; PC
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=AC"
                className="hover:text-teal-400"
              >
                AC &amp; Refrigerator
              </Link>
            </li>
            <li>
              <Link
                href="/services?category=Electrical"
                className="hover:text-teal-400"
              >
                Electrical
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
            Contact &amp; Social
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              <span>support@fixmate.app</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>+880 1700-000000</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>

          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="FixMate on X"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © 2026 FixMate. All rights reserved.
      </div>
    </footer>
  );
}