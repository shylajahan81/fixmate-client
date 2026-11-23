'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">
        Something went wrong
      </h1>
      <p className="text-sm text-slate-600 mt-2 max-w-md">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800"
      >
        Try Again
      </button>
    </div>
  );
}