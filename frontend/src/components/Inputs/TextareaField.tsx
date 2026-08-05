import { useId } from 'react';
import { useFieldContext } from '../../hooks/form-context';
import { formatFieldErrors } from '../../utils/formFieldErrors';

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function TextareaField({
  label,
  placeholder,
  required,
  rows = 4,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium tracking-wide text-ink"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-pour">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        name={field.name}
        value={field.state.value}
        placeholder={placeholder}
        required={required}
        rows={rows}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`w-full resize-y rounded-md border bg-[#2a150d] px-3 py-2 text-base text-amber-50 transition-colors duration-150 placeholder:text-amber-100/40 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/70 sm:text-sm ${
          hasError ? 'border-red-500/70' : 'border-amber-900/40'
        }`}
      />
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {formatFieldErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
