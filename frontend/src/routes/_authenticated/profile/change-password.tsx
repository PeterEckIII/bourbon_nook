import { createFileRoute } from '@tanstack/react-router';
import useChangePasswordForm from '../../../hooks/useChangePasswordForm';

export const Route = createFileRoute('/_authenticated/profile/change-password')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { form, serverError } = useChangePasswordForm();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
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
          <form.AppField
            name="oldPassword"
            children={(field) => (
              <field.TextField label="Current Password" type="password" />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="newPassword"
            children={(field) => (
              <field.TextField label="New Password" type="password" />
            )}
          />
        </div>
        <div>
          <form.AppField
            name="confirmPassword"
            children={(field) => (
              <field.TextField label="Confirm Password" type="password" />
            )}
          />
        </div>
        <form.AppForm>
          <form.SubmitButton label="Change password" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
