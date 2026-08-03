import { z } from 'zod';
import { useAppForm } from '../../hooks/form';
import type { AuthState } from '../../auth/types';
import { Link, useNavigate } from '@tanstack/react-router';

const registerSchema = z.object({
  email: z.email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(18, 'Password should be less than 18 characters')
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,18}$/,
    ),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(18, 'Password should be less than 18 characters'),
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
            name="username"
            children={(field) => (
              <field.TextField
                label="Username"
                type="text"
                placeholder="flyguy85"
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
