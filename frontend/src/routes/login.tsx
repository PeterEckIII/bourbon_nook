import { createFileRoute, redirect } from '@tanstack/react-router';
import LoginForm from '../components/Forms/LoginForm';

export const Route = createFileRoute('/login')({
  staticData: { showNavbar: false },
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/',
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const { auth } = Route.useRouteContext();
  const { redirect } = Route.useSearch();

  return <LoginForm auth={auth} redirect={redirect} />;
}
