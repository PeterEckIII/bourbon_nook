import { createFileRoute, Link } from '@tanstack/react-router';
import useChangePasswordForm from '../../../hooks/useChangePasswordForm';

export const Route = createFileRoute('/_authenticated/profile/change-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const { form, serverError } = useChangePasswordForm();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="max-w-md w-full">
        <Link
          to="/profile"
          className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
        >
          ← Back to Profile
        </Link>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
        className="max-w-md w-full space-y-4 p-6 border border-ink/15 rounded-lg bg-cream"
      >
        <h1 className="font-caprasimo text-2xl text-center">Change Password</h1>
        {serverError && (
          <p className="text-sm text-red-700" role="alert">
            {serverError}
          </p>
        )}
        <div>
          <form.AppField name="oldPassword">
            {(field) => <field.TextField label="Current Password" type="password" />}
          </form.AppField>
        </div>
        <div>
          <form.AppField name="newPassword">
            {(field) => <field.TextField label="New Password" type="password" />}
          </form.AppField>
        </div>
        <div>
          <form.AppField name="confirmPassword">
            {(field) => <field.TextField label="Confirm Password" type="password" />}
          </form.AppField>
        </div>
        <form.AppForm>
          <form.SubmitButton label="Change password" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
