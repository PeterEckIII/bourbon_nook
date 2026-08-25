import { describe, it, expect, vi } from 'vite-plus/test';
import { screen, waitFor } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../file-route-utils';
import userEvent from '@testing-library/user-event';

// checkEmailAvailability/checkUsernameAvailability hit the real backend via
// customUsersInstance — mock them so typing a valid-looking email/username
// doesn't fire a real network request after the 500ms debounce.
vi.mock('../../../api/generated/users-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/users-api')>();
  return {
    ...actual,
    checkEmailAvailability: vi.fn().mockResolvedValue(true),
    checkUsernameAvailability: vi.fn().mockResolvedValue(true),
  };
});

// Redirecting an already-authenticated user lands on the authenticated home
// route, whose loader fetches bottles/reviews via ensureQueryData — mock
// both so that redirect doesn't fire real network requests.
vi.mock('../../../api/generated/bottles-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/bottles-api')>();
  return {
    ...actual,
    getUserBottlesQueryOptions: () => ({
      queryKey: actual.getUserBottlesQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserBottlesSuspense: () => ({ data: [] }),
  };
});

vi.mock('../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/reviews-api')>();
  return {
    ...actual,
    getUserReviewsQueryOptions: () => ({
      queryKey: actual.getUserReviewsQueryKey(),
      queryFn: () => Promise.resolve([]),
    }),
    useUserReviewsSuspense: () => ({ data: [] }),
  };
});

describe('Register route', () => {
  it('renders the register form', async () => {
    renderWithFileRoutes({
      initialLocation: '/register',
    });

    expect(await screen.findByText('Join BourbonNook')).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: /username/i })).toBeInTheDocument();
    expect(await screen.findByLabelText(/^password/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('redirects an already-authenticated user away from /register', async () => {
    renderWithFileRoutes({
      initialLocation: '/register',
      routerContext: {
        auth: createMockAuthState({ isAuthenticated: true }),
      },
    });

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /email/i })).not.toBeInTheDocument();
  });

  it('shows a validation error for a short password', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/register',
    });

    await user.type(await screen.findByLabelText(/^password/i), 'short');

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows a validation error when the passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/register',
    });

    await user.type(await screen.findByLabelText(/^password/i), 'mysecretpw1!');
    await user.type(await screen.findByLabelText(/confirm password/i), 'somethingelse1!');

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('disables submit until every field is valid', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/register',
    });

    const button = await screen.findByRole('button', { name: /register/i });

    await user.type(await screen.findByRole('textbox', { name: /email/i }), 'notanemail');
    expect(button).toBeDisabled();

    await user.clear(screen.getByRole('textbox', { name: /email/i }));
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'peter@me.com');
    await user.type(screen.getByRole('textbox', { name: /username/i }), 'petey_wheeler45');
    await user.type(screen.getByLabelText(/^password/i), 'mysecretpw1!');
    await user.type(screen.getByLabelText(/confirm password/i), 'mysecretpw1!');

    await waitFor(() => expect(button).not.toBeDisabled(), { timeout: 2000 });
  });

  it('shows the backend message on a failed registration', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/register',
      routerContext: {
        auth: createMockAuthState({
          register: vi.fn().mockRejectedValue({
            isAxiosError: true,
            response: { data: { message: 'Email is already registered' } },
          }),
        }),
      },
    });

    await user.type(await screen.findByRole('textbox', { name: /email/i }), 'peter@me.com');
    await user.type(await screen.findByRole('textbox', { name: /username/i }), 'petey_wheeler45');
    await user.type(await screen.findByLabelText(/^password/i), 'mysecretpw1!');
    await user.type(await screen.findByLabelText(/confirm password/i), 'mysecretpw1!');

    const button = await screen.findByRole('button', { name: /register/i });
    await waitFor(() => expect(button).not.toBeDisabled(), { timeout: 2000 });
    await user.click(button);

    expect(await screen.findByRole('alert')).toHaveTextContent(/email is already registered/i);
  });

  it('navigates to the redirect target on a successful registration', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/register?redirect=%2Fabout',
    });

    await user.type(await screen.findByRole('textbox', { name: /email/i }), 'peter@me.com');
    await user.type(await screen.findByRole('textbox', { name: /username/i }), 'petey_wheeler45');
    await user.type(await screen.findByLabelText(/^password/i), 'mysecretpw1!');
    await user.type(await screen.findByLabelText(/confirm password/i), 'mysecretpw1!');

    const button = await screen.findByRole('button', { name: /register/i });
    await waitFor(() => expect(button).not.toBeDisabled(), { timeout: 2000 });
    await user.click(button);

    expect(await screen.findByText('About Bourbon Nook')).toBeInTheDocument();
  });
});
