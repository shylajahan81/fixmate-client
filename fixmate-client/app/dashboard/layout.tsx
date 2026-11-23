'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  UserCog,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  Wrench,
  ClipboardList,
  Users,
  CheckSquare,
  Receipt,
} from 'lucide-react';
import { getDashboardPath, getSession } from '../lib/api';
import { AuthSession, UserRole } from '../../types/fixmate';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const ROLE_MENUS: Record<UserRole, NavItem[]> = {
  customer: [
    { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
    {
      href: '/dashboard/customer/bookings',
      label: 'My Bookings',
      icon: CalendarCheck,
    },
    {
      href: '/dashboard/customer/payments',
      label: 'Payment History',
      icon: CreditCard,
    },
    { href: '/dashboard/profile', label: 'Update Profile', icon: UserCog },
  ],
  technician: [
    { href: '/dashboard/technician', label: 'Overview', icon: LayoutDashboard },
    {
      href: '/dashboard/technician/add-service',
      label: 'Add Service',
      icon: PlusCircle,
    },
    {
      href: '/dashboard/technician/my-services',
      label: 'My Services',
      icon: Wrench,
    },
    {
      href: '/dashboard/technician/requests',
      label: 'Manage Requests',
      icon: ClipboardList,
    },
    { href: '/dashboard/profile', label: 'Update Profile', icon: UserCog },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    {
      href: '/dashboard/admin/services',
      label: 'Service Approval',
      icon: CheckSquare,
    },
    {
      href: '/dashboard/admin/bookings',
      label: 'All Bookings',
      icon: CalendarCheck,
    },
    {
      href: '/dashboard/admin/transactions',
      label: 'Transactions',
      icon: Receipt,
    },
    { href: '/dashboard/profile', label: 'Update Profile', icon: UserCog },
  ],
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AuthSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      const current = getSession();
      if (!current?.user) {
        setSession(null);
        setCheckingAuth(false);
        router.replace(
          `/sign-in?redirect=${encodeURIComponent(pathname || '/dashboard')}`
        );
        return;
      }

      const role = current.user.role || 'customer';
      const isCustomerRoute = pathname.startsWith('/dashboard/customer');
      const isTechnicianRoute = pathname.startsWith('/dashboard/technician');
      const isAdminRoute = pathname.startsWith('/dashboard/admin');

      if (
        (isCustomerRoute && role !== 'customer') ||
        (isTechnicianRoute && role !== 'technician') ||
        (isAdminRoute && role !== 'admin')
      ) {
        setForbidden(true);
      } else {
        setForbidden(false);
      }

      setSession(current);
      setCheckingAuth(false);
    };

    syncSession();
    window.addEventListener('fixmate-auth-change', syncSession);
    return () => window.removeEventListener('fixmate-auth-change', syncSession);
  }, [pathname, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-600">
        Verifying dashboard access...
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const menuItems = ROLE_MENUS[user.role] || ROLE_MENUS.customer;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 flex flex-col justify-between transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <Link
              href={getDashboardPath(user.role)}
              className="text-lg font-bold tracking-tight text-white"
            >
              FixMate <span className="text-teal-400 text-xs uppercase">{user.role}</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-5 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${active
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-slate-900 capitalize">
              {user.role} Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <img
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=0f766e&color=fff`
              }
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {forbidden ? (
            <div className="max-w-lg mx-auto mt-12 bg-white rounded-2xl border border-rose-200 p-8 text-center">
              <h1 className="text-xl font-bold text-rose-600">
                403 — Forbidden Access
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Your account role (<strong>{user.role}</strong>) does not have
                permission to view this page.
              </p>
              <Link
                href={getDashboardPath(user.role)}
                className="inline-block mt-5 px-4 py-2 rounded-xl bg-teal-700 text-white text-sm font-semibold"
              >
                Go to My Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}