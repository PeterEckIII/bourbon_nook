import { useFormContext } from '../../hooks/form-context';

interface SubmitButtonProps {
  label?: string;
  submittingLabel?: string;
  fullWidth?: boolean;
}

export default function SubmitButton({
  label = 'Submit',
  submittingLabel = 'Submitting…',
  fullWidth = false,
}: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting] as const}
    >
      {([canSubmit, isSubmitting]) => (
        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className={`w-full cursor-pointer rounded-md border border-amber-500/40 bg-amber-600 px-4 py-2.5 text-base font-medium tracking-wide text-amber-50 transition-colors duration-150 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/70 focus:ring-offset-2 focus:ring-offset-ground disabled:cursor-not-allowed disabled:opacity-50 ${fullWidth ? '' : 'sm:w-auto sm:min-w-40 sm:text-sm'}`}
        >
          {isSubmitting ? submittingLabel : label}
        </button>
      )}
    </form.Subscribe>
  );
}
