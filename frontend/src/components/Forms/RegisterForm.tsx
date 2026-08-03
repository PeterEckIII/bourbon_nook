import { z } from 'zod';
import { useAppForm } from '../../hooks/form';
import type { AuthState } from '../../auth/types';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  checkEmailAvailability,
  checkUsernameAvailability,
} from '../../api/generated/users-api';

const registerSchema = z.object({
  email: z.email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Username cannot contain special characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type Register = z.infer<typeof registerSchema>;

const defaultValues: Register = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

interface RegisterFormProps {
  auth: AuthState;
  redirect: string;
}

export default function RegisterForm({ auth, redirect }: RegisterFormProps) {
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await auth.register({
          email: value.email,
          username: value.username,
          password: value.password,
        });
        navigate({ to: redirect || '/dashboard' });
      } catch (error) {
        console.log(`Error registering user: ${error}`);
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
        <h1 className="text-2xl font-bold">Join BourbonNook</h1>
        <div>
          <form.AppField
            name="email"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                const isAvailable = await checkEmailAvailability({
                  email: value,
                });
                return isAvailable
                  ? undefined
                  : 'Email is already registered at BourbonNook';
              },
            }}
            children={(field) => (
              <field.TextField
                label="Email"
                type="email"
                placeholder="john@whiskey.org"
                required
              />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="username"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                if (value.length < 3) return undefined;
                const isAvailable = await checkUsernameAvailability({
                  username: value,
                });
                return isAvailable ? undefined : 'Username is already taken';
              },
            }}
            children={(field) => (
              <field.TextField
                label="Username"
                type="text"
                placeholder="whiskey_novice55"
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
        <div>
          <form.AppField
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return 'Passwords do not match';
                }
                return undefined;
              },
            }}
            children={(field) => (
              <field.TextField
                label="Confirm Password"
                type="password"
                placeholder="*********"
                required
              />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton label="Register" />
        </form.AppForm>
        <div>
          Already have an account?{' '}
          <Link
            to="/login"
            search={{ redirect }}
            className="text-blue-500 hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
