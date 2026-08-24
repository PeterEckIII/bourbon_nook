import { useFormContext } from '../../hooks/form-context';
import { buttonClasses } from './buttonClasses';

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
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <button
          type="submit"
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className={`${buttonClasses({ variant: 'primary', size: 'lg', ringOffset: 'cream', fullWidth: true })} ${fullWidth ? '' : 'sm:w-auto sm:min-w-40 sm:text-sm'}`}
        >
          {isSubmitting ? submittingLabel : label}
        </button>
      )}
    </form.Subscribe>
  );
}
