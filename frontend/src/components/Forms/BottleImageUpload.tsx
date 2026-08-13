import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useImageCreate, getUserBottleQueryKey } from '../../api/generated/bottles-api';
import { useAppForm } from '../../hooks/form';
import { getApiErrorMessage } from '../../api/errors';

export default function BottleImageUpload({
  bottleId,
  hasImage,
}: {
  bottleId: string;
  hasImage: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: uploadImage } = useImageCreate();

  const form = useAppForm({
    defaultValues: { file: null as File | null },
    onSubmit: async ({ value }) => {
      if (!value.file) return;
      setServerError(null);
      try {
        await uploadImage({ bottleId, data: { file: value.file } });
        await queryClient.invalidateQueries({
          queryKey: getUserBottleQueryKey(bottleId),
        });
        form.reset();
        setIsOpen(false);
      } catch (error) {
        setServerError(getApiErrorMessage(error));
      }
    },
  });

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-sm text-sm font-medium text-ink/60 underline-offset-2 transition-colors duration-150 hover:text-ink hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500/70"
      >
        {hasImage ? 'Replace photo' : 'Add photo'}
      </button>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      {serverError && (
        <p role="alert" className="text-sm text-red-700">
          {serverError}
        </p>
      )}
      <form.AppField
        name="file"
        children={(field) => <field.FileField label="Bottle Photo" required />}
      />
      <div className="flex gap-3">
        <form.AppForm>
          <form.SubmitButton label="Upload" submittingLabel="Uploading…" />
        </form.AppForm>
        <button
          type="button"
          onClick={() => {
            form.reset();
            setServerError(null);
            setIsOpen(false);
          }}
          className="rounded-md border border-ink/20 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors duration-150 hover:border-pour hover:text-ink focus:outline-none focus:ring-2 focus:ring-amber-500/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
