import { useEffect, useId, useMemo, useRef, useState, type DragEvent } from 'react';
import { useFieldContext } from '../../hooks/form-context';
import { formatFieldErrors } from '../../utils/formFieldErrors';

interface FileFieldProps {
  label: string;
  required?: boolean;
  accept?: string;
  helperText?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileField({
  label,
  required,
  accept = 'image/png, image/jpeg, image/webp',
  helperText = 'PNG, JPEG or WEBP',
}: FileFieldProps) {
  const field = useFieldContext<File | null>();
  const id = useId();
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const file = field.state.value;
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function setFile(next: File | null) {
    field.handleChange(next);
    field.handleBlur();
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (!dropped) return;

    // Dropping a file only updates React state, not the native input's
    // `files` property, so its `required` constraint validation would
    // still block submission unless we sync it here too.
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(dropped);
      inputRef.current.files = dataTransfer.files;
    }
    setFile(dropped);
  }

  function handleRemove() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium tracking-wide text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-pour">
            *
          </span>
        )}
      </label>

      {file ? (
        <div
          className={`flex items-center gap-3 rounded-md border bg-cask p-3 ${
            hasError ? 'border-red-500/70' : 'border-amber-900/40'
          }`}
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-amber-900/40 bg-black/20">
            {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-amber-50">{file.name}</p>
            <p className="text-xs text-amber-100/50">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md border border-amber-900/40 px-2.5 py-1.5 text-xs font-medium text-amber-100 transition-colors duration-150 hover:border-amber-500/70 hover:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${label}`}
              className="rounded-md border border-ink/20 px-2.5 py-1.5 text-xs text-ink/70 transition-colors duration-150 hover:border-pour hover:text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/70"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-cask px-4 py-8 text-center transition-colors duration-150 has-focus-visible:ring-2 has-focus-visible:ring-amber-500/70 ${
            isDragging
              ? 'border-amber-500/70 bg-toast'
              : hasError
                ? 'border-red-500/70'
                : 'border-amber-900/40 hover:border-amber-500/50'
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-amber-100/50"
          >
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-amber-100/70">
            <span className="font-medium text-amber-50">Click to upload</span> or drag and drop
          </p>
          {helperText && <p className="text-xs text-amber-100/40">{helperText}</p>}
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        name={field.name}
        type="file"
        accept={accept}
        required={required}
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        onBlur={field.handleBlur}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="sr-only"
      />

      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {formatFieldErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
