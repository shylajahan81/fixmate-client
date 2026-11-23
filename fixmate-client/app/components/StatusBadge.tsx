interface StatusBadgeProps {
  status: string;
}

const BADGE_STYLES: Record<string, string> = {
  requested: 'bg-blue-100 text-blue-800',
  accepted: 'bg-indigo-100 text-indigo-800',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
  paid: 'bg-emerald-100 text-emerald-800',
  approved: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  unpaid: 'bg-slate-100 text-slate-700',
  rejected: 'bg-rose-100 text-rose-800',
  cancelled: 'bg-slate-200 text-slate-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase();
  const styleClass = BADGE_STYLES[normalized] || 'bg-slate-100 text-slate-700';

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styleClass}`}
    >
      {status}
    </span>
  );
}