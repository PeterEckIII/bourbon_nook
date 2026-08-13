import { createFileRoute, Link } from '@tanstack/react-router';
import { getGetUserQueryOptions, useGetUserSuspense } from '../../../../api/generated/users-api';
import useUpdateUserForm from '../../../../hooks/useUpdateUserForm';

export const Route = createFileRoute('/_authenticated/admin/users/$userId_/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getGetUserQueryOptions(params.userId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { data: user } = useGetUserSuspense(userId);
  const { form, serverError } = useUpdateUserForm({
    userId,
    defaultValues: { email: user.email, username: user.username },
  });
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/admin/users"
        className="text-sm text-ink/60 transition-colors duration-150 hover:text-ink"
      >
        ← Back to Users
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-semibold text-ink">Edit User {user.userId}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
        className="max-w-md space-y-4 rounded-lg border border-ink/15 bg-cream p-6"
      >
        {serverError && (
          <p role="alert" className="text-sm text-red-700">
            {serverError}
          </p>
        )}
        <div>
          <form.AppField name="email">
            {(field) => <field.TextField label="Email" type="email" />}
          </form.AppField>
        </div>
        <div>
          <form.AppField name="username">
            {(field) => <field.TextField label="Username" type="text" />}
          </form.AppField>
        </div>
        <form.AppForm>
          <form.SubmitButton label="Update user" fullWidth />
        </form.AppForm>
      </form>
    </div>
  );
}
