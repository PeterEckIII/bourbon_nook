import type { AuthState } from '../../auth/types';
import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useAppForm } from '../../hooks/form';

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
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await auth.login({ email: value.email, password: value.password });
        navigate({ to: redirect || '/dashboard' });
      } catch (error) {
        console.log(`Error logging in: ${error}`);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="max-w-md w-full space-y-4 p-6 border rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <div>
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField
                label="Email"
                type="email"
                placeholder="john@hopkins.edu"
                required
              />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="password"
            children={(field) => (
              <field.TextField
                label="Password"
                type="password"
                placeholder="*********"
                required
              />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton label="Log in" />
        </form.AppForm>
        <div>
          Not a member?{' '}
          <Link
            to="/register"
            search={{ redirect }}
            className="text-blue-500 hover:underline"
          >
            Register today
          </Link>
        </div>
      </form>
    </div>
  );
}
