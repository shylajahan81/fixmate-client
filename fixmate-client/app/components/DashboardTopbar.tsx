'use client';

import { Menu } from 'lucide-react';
import { UserProfile } from '../../types/fixmate';

interface DashboardTopbarProps {
  user: UserProfile;
  onOpenSidebar: () => void;
}

export default function DashboardTopbar({
  user,
  onOpenSidebar,
}: DashboardTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open Sidebar"
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-900 capitalize">
            {user.role} Workspace
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-900 leading-tight">
            {user.name}
          </p>
          <span className="inline-block mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-700">
            {user.role}
          </span>
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
  );
}