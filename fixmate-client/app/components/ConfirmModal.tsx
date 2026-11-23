'use client';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}