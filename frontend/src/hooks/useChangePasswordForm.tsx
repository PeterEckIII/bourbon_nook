import z from 'zod';
import { useAppForm } from './form';
import { changePassword } from '../api/generated/users-api';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { getApiErrorMessage } from '../api/errors';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Please enter your old password'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type ChangePassword = z.infer<typeof changePasswordSchema>;

const defaultValues: ChangePassword = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function useChangePasswordForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useAppForm({
    defaultValues,
    validators: { onBlur: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
          confirmPassword: value.confirmPassword,
        });
        navigate({ to: '/profile' });
      } catch (error) {
        setServerError(getApiErrorMessage(error));
      }
    },
  });

  return { form, serverError };
}
