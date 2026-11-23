'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  UserCog,
} from 'lucide-react';
import { AuthSession } from '../../types/fixmate';
import { clearSession, getDashboardPath, getSession } from '../lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => setSession(getSession());
    syncAuth();
    window.addEventListener('fixmate-auth-change', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('fixmate-auth-change', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
  ];

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push('/sign-in');
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
            <Wrench className="w-5 h-5" />
          </span>
          <span>FixMate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${isActive
                  ? 'text-teal-700 font-semibold underline underline-offset-8'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50"
              >
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=0f766e&color=fff`
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-lg p-3 z-50">
                  <div className="px-2 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.name}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-800 capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <UserCog className="w-4 h-4" />
                      Update Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {!user ? (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl border border-slate-300 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 capitalize">
                    {user.role}
                  </span>
                </div>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm bg-slate-100"
                >
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}