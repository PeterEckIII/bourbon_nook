import { useState } from 'react';
import { z } from 'zod';
import { useAppForm } from './form';
import { bottleDelete } from '../api/generated/bottles-api';
import { getApiErrorMessage } from '../api/errors';

const deleteBottleSchema = z.object({
  bottleId: z.string(),
});

type DeleteBottle = z.infer<typeof deleteBottleSchema>;

export default function useBottleDeleteForm({
  bottleId,
}: {
  bottleId: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const defaultValues: DeleteBottle = { bottleId };
  const form = useAppForm({
    defaultValues,
    validators: {
      onBlur: deleteBottleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await bottleDelete(value.bottleId);
        // invalidate bottle data
      } catch (error) {
        setServerError(getApiErrorMessage(error));
      }
    },
  });

  return {
    form,
    serverError,
  };
}
