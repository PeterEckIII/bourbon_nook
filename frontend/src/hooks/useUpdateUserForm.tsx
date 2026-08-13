import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { useAppForm } from './form';
import { getGetUsersQueryKey, updateUser } from '../api/generated/users-api';
import { getApiErrorMessage } from '../api/errors';

const editUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type EditUser = z.infer<typeof editUserSchema>;

export default function useUpdateUserForm({
  userId,
  defaultValues,
}: {
  userId: string;
  defaultValues: EditUser;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues,
    validators: {
      onBlur: editUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateUser(userId, {
          email: value.email,
          username: value.username,
        });
        await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });
        return navigate({ to: '/admin/users' });
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
