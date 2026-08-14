import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import { changePassword } from '../../../api/generated/users-api';

function renderChangePasswordRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/profile/change-password',
    routerContext: {
      auth: createMockAuthState({
        user: {
          id: '123abc',
          email: 'test@email.com',
          username: 'testuser',
          roles: ['ROLE_USER'],
        },
        isAuthenticated: true,
        changePassword: vi.fn().mockReturnValue({}),
      }),
    },
  });
}

async function getSelectors() {
  const title = await screen.findByRole('heading', { level: 1, name: /change password/i });
  const backToProfileLink = await screen.findByRole('link', { name: /← back to profile/i });
  const currentPasswordInput = await screen.findByLabelText(/current password/i);
  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
  const submitButton = await screen.findByRole('button', { name: /change password/i });

  return {
    title,
    backToProfileLink,
    currentPasswordInput,
    newPasswordInput,
    confirmPasswordInput,
    submitButton,
  };
}

vi.mock('../../../api/generated/users-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/users-api')>();

  return {
    ...actual,
    changePassword: vi.fn(),
  };
});

describe('Change password route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders the form elements correctly', async () => {
    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();

    expect(selectors.title).toBeInTheDocument();
    expect(selectors.backToProfileLink).toBeInTheDocument();
    expect(selectors.currentPasswordInput).toBeInTheDocument();
    expect(selectors.newPasswordInput).toBeInTheDocument();
    expect(selectors.confirmPasswordInput).toBeInTheDocument();
    expect(selectors.submitButton).toBeInTheDocument();
  });
  it('shows client-side validation', async () => {
    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.click(selectors.currentPasswordInput);
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter your old password');
    await user.type(selectors.currentPasswordInput, 'Password123@');
    await user.type(selectors.newPasswordInput, 'pass');
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /new password must be at least 8 characters/i,
    );
    await user.type(selectors.newPasswordInput, 'Password456$');
    await user.type(selectors.confirmPasswordInput, 'pass');
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /password must be at least 8 characters/i,
    );
  });
  it('shows error when the current password entered is incorrect', async () => {
    vi.mocked(changePassword).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Wrong existing password' } },
    });
    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.type(selectors.currentPasswordInput, 'Password123$');
    await user.type(selectors.newPasswordInput, 'Password456@');
    await user.type(selectors.confirmPasswordInput, 'Password456&');
    await user.click(selectors.submitButton);
    expect(await screen.findByRole('alert')).toHaveTextContent(/wrong existing password/i);
  });
  it("shows error when the new password and confirm password don't match", async () => {
    vi.mocked(changePassword).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'Passwords do not match' } },
    });
    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.type(selectors.currentPasswordInput, 'Password123$');
    await user.type(selectors.newPasswordInput, 'Password456@');
    await user.type(selectors.confirmPasswordInput, 'Password456&');
    await user.click(selectors.submitButton);
    expect(await screen.findByRole('alert')).toHaveTextContent(/passwords do not match/i);
  });
  it('shows fallback error if the error is unexpected', async () => {
    vi.mocked(changePassword).mockRejectedValueOnce(new Error('Oops!'));
    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.type(selectors.currentPasswordInput, 'Password123$');
    await user.type(selectors.newPasswordInput, 'Password456@');
    await user.type(selectors.confirmPasswordInput, 'Password456@');
    await user.click(selectors.submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /something went wrong. Please try again/i,
    );
  });
  it('correctly handles button pending/disabled state', async () => {
    let rejectChangePassword: (reason: unknown) => void = () => {};
    vi.mocked(changePassword).mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectChangePassword = reject;
        }),
    );

    renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.type(selectors.currentPasswordInput, 'Password123@');
    await user.tab();
    expect(selectors.submitButton).toBeDisabled();
    await user.type(selectors.newPasswordInput, 'Password456!');
    await user.tab();
    expect(selectors.submitButton).toBeDisabled();
    await user.type(selectors.confirmPasswordInput, 'Password456!');
    await user.tab();
    expect(selectors.submitButton).not.toBeDisabled();

    await user.click(selectors.submitButton);
    expect(selectors.submitButton).toHaveTextContent(/submitting/i);
    expect(selectors.submitButton).toHaveAttribute('aria-busy', 'true');

    rejectChangePassword(new Error('oops'));
    await waitFor(() => expect(selectors.submitButton).not.toHaveTextContent(/submitting/i));
  });
  it('allows form submission', async () => {
    vi.mocked(changePassword).mockReturnValue({} as ReturnType<typeof changePassword>);
    const { router } = renderChangePasswordRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.type(selectors.currentPasswordInput, 'Password123$');
    await user.type(selectors.newPasswordInput, 'Password456@');
    await user.type(selectors.confirmPasswordInput, 'Password456@');
    await user.click(selectors.submitButton);

    expect(changePassword).toHaveBeenCalledWith({
      oldPassword: 'Password123$',
      newPassword: 'Password456@',
      confirmPassword: 'Password456@',
    });
    expect(router.state.location.pathname).toEqual('/profile');
  });
});
