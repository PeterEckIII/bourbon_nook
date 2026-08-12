import { useEffect, useId, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="m-auto bg-transparent p-0 backdrop:bg-ink/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-ink/15 bg-cream p-6 text-ink"
      >
        <h2 id={titleId} className="font-caprasimo text-lg">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-ink/70" role="alert">
            {description}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-ink/20 px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-ink/5 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-cream"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            aria-busy={isConfirming}
            className="cursor-pointer rounded-md border border-red-700/40 bg-red-700 px-4 py-2 text-sm font-medium text-red-50 transition-colors duration-150 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/70 focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isConfirming ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
