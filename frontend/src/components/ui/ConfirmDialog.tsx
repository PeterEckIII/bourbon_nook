import { useEffect, useId, useRef } from 'react';
import { buttonClasses } from './buttonClasses';

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
      className="m-auto bg-transparent p-0 backdrop:bg-radial backdrop:from-char/50 backdrop:via-barrel/60 backdrop:to-barrel/80"
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
            className={buttonClasses({ variant: 'secondary' })}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            aria-busy={isConfirming}
            className={buttonClasses({ variant: 'danger' })}
          >
            {isConfirming ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
