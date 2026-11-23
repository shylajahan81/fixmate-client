export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-teal-700 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-600">Loading FixMate...</p>
      </div>
    </div>
  );
}