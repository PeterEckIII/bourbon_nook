import { useId, useState, type KeyboardEvent } from 'react';
import { useFieldContext } from '../../hooks/form-context';
import { formatFieldErrors } from '../../utils/formFieldErrors';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxFieldProps {
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  emptyMessage?: string;
}

export default function ComboboxField({
  label,
  options,
  placeholder,
  required,
  emptyMessage = 'No matches',
}: ComboboxFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const listboxId = `${id}-listbox`;
  const errorId = `${id}-error`;
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const selectedOption = options.find((option) => option.value === field.state.value);

  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [syncedLabel, setSyncedLabel] = useState(selectedOption?.label);

  if (selectedOption?.label !== syncedLabel) {
    setSyncedLabel(selectedOption?.label);
    setQuery(selectedOption?.label ?? '');
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions =
    !normalizedQuery || query === selectedOption?.label
      ? options
      : options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));

  function selectOption(option: ComboboxOption) {
    field.handleChange(option.value);
    setQuery(option.label);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (isOpen) setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
        event.preventDefault();
        selectOption(filteredOptions[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      if (isOpen) {
        setIsOpen(false);
        setActiveIndex(-1);
        setQuery(selectedOption?.label ?? '');
      }
    }
  }

  const activeOptionId =
    activeIndex >= 0 && filteredOptions[activeIndex]
      ? `${id}-option-${filteredOptions[activeIndex].value}`
      : undefined;

  return (
    <div className="relative flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium tracking-wide text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-pour">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={field.name}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          setIsOpen(true);
          setActiveIndex(-1);
          if (value === '') field.handleChange('');
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsOpen(false);
          setActiveIndex(-1);
          setQuery(selectedOption?.label ?? '');
          field.handleBlur();
        }}
        className={`w-full rounded-md border bg-cask px-3 py-2 text-base text-amber-50 transition-colors duration-150 placeholder:text-amber-100/40 focus:border-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/70 sm:text-sm ${
          hasError ? 'border-red-500/70' : 'border-amber-900/40'
        }`}
      />
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-md border border-amber-900/40 bg-cask py-1 shadow-lg"
        >
          {filteredOptions.length === 0 && (
            <li className="px-3 py-2 text-sm text-amber-100/50">{emptyMessage}</li>
          )}
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${option.value}`}
              role="option"
              aria-selected={option.value === field.state.value}
              onMouseEnter={() => setActiveIndex(index)}
              onPointerDown={(event) => {
                event.preventDefault();
                selectOption(option);
              }}
              className={`cursor-pointer px-3 py-2 text-base text-amber-50 sm:text-sm ${
                index === activeIndex ? 'bg-amber-600/20' : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {hasError && (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {formatFieldErrors(field.state.meta.errors)}
        </p>
      )}
    </div>
  );
}
