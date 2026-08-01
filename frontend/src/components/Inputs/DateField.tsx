import { useEffect, useId, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { useFieldContext } from '../../hooks/form-context';
import { formatFieldErrors } from '../../utils/formFieldErrors';

const displayFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});

function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromIsoDateString(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

interface DateFieldProps {
  label: string;
  required?: boolean;
}

export default function DateField({ label, required }: DateFieldProps) {
  const field = useFieldContext<string>();
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const selectedDate = fromIsoDateString(field.state.value);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        field.handleBlur();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        field.handleBlur();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, field]);

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium tracking-wide text-amber-100/90"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-amber-500">
            *
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full rounded-md border bg-[#2a150d] px-3 py-2 text-left text-base text-amber-50 transition-colors duration-150 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/70 sm:text-sm ${
            hasError ? 'border-red-500/70' : 'border-amber-900/40'
          }`}
        >
          {selectedDate ? (
            displayFormatter.format(selectedDate)
          ) : (
            <span className="text-amber-100/40">Select date</span>
          )}
        </button>
        {selectedDate && (
          <button
            type="button"
            onClick={() => {
              field.handleChange('');
              field.handleBlur();
            }}
            aria-label={`Clear ${label}`}
            className="shrink-0 cursor-pointer rounded-md border border-amber-900/40 px-2 py-2 text-amber-100/70 transition-colors duration-150 hover:border-amber-500/70 hover:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
          >
            ✕
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 flex justify-center">
          <div
            role="dialog"
            aria-label={label}
            className="bourbon-daypicker rounded-md border border-amber-900/40 bg-[#2a150d] p-2 shadow-lg"
          >
            <DayPicker
              autoFocus
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                field.handleChange(date ? toIsoDateString(date) : '');
                field.handleBlur();
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
            />
          </div>
        </div>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-400">
          {formatFieldErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
