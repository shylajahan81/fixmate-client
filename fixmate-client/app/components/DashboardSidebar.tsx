'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
import { UserRole } from '../../types/fixmate';
import { getDashboardPath } from '../lib/api';

interface SidebarItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const ROLE_MENU: Record<UserRole, SidebarItem[]> = {
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

interface DashboardSidebarProps {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  role,
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = ROLE_MENU[role] || ROLE_MENU.customer;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/45 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 flex flex-col justify-between transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <Link
              href={getDashboardPath(role)}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-lg font-bold text-white"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </span>
              <span>FixMate</span>
              <span className="text-[11px] uppercase px-2 py-0.5 rounded bg-teal-900 text-teal-200">
                {role}
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Sidebar"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-5 space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}