import { useState } from 'react';
import type { AuthState } from '../../auth/types';
import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useAppForm } from '../../hooks/form';
import { getApiErrorMessage } from '../../api/errors';
import mark from '../../assets/brand/svg/mark-color.svg';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string(),
});

type Login = z.infer<typeof loginSchema>;

const defaultValues: Login = {
  email: '',
  password: '',
};

interface LoginFormProps {
  auth: AuthState;
  redirect: string;
}

export default function LoginForm({ auth, redirect }: LoginFormProps) {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await auth.login({ email: value.email, password: value.password });
        navigate({ to: redirect || '/dashboard' });
      } catch (error) {
        setServerError(getApiErrorMessage(error));
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="max-w-md w-full space-y-4 p-6 border border-ink/15 rounded-lg bg-cream"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <img src={mark} alt="Bourbon Nook" className="h-16 w-16 mx-auto" />
        <h1 className="font-caprasimo text-2xl text-center">Log in to BourbonNook</h1>
        {serverError && (
          <p role="alert" className="text-sm text-red-700">
            {serverError}
          </p>
        )}
        <div>
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField label="Email" type="email" placeholder="john@hopkins.edu" required />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="password"
            children={(field) => (
              <field.TextField label="Password" type="password" placeholder="*********" required />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton label="Log in" fullWidth />
        </form.AppForm>
        <div>
          Not a member?{' '}
          <Link to="/register" search={{ redirect }} className="text-blue-500 hover:underline">
            Register today
          </Link>
        </div>
      </form>
    </div>
  );
}
