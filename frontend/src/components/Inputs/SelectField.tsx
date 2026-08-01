import { useId } from 'react';
import { useFieldContext } from '../../hooks/form-context';
import { formatFieldErrors } from '../../utils/formFieldErrors';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export default function SelectField({
  label,
  options,
  placeholder,
  required,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
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
      <div className="relative">
        <select
          id={id}
          name={field.name}
          value={field.state.value}
          required={required}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full appearance-none rounded-md border bg-[#2a150d] px-3 py-2 pr-9 text-base text-amber-50 transition-colors duration-150 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/70 sm:text-sm ${
            hasError ? 'border-red-500/70' : 'border-amber-900/40'
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-100/60"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-400">
          {formatFieldErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
