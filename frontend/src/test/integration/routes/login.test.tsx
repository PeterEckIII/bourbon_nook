import { describe, it, expect, vi } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../file-route-utils';
import userEvent from '@testing-library/user-event';

describe('Login route', () => {
  it('should test the login components are visible', async () => {
    renderWithFileRoutes({
      initialLocation: '/login',
    });
    expect(await screen.findByText(/Log in to BourbonNook/i)).toBeInTheDocument();
    expect(await screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(await screen.findByLabelText(/password/i)).toBeInTheDocument();

    expect(await screen.findByRole('button', { name: /Log in/i })).toBeInTheDocument();

    expect(await screen.findByRole('link', { name: /register today/i })).toBeInTheDocument();
  });
  it('should test an unauthorized login attempt', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/login',
      routerContext: {
        auth: createMockAuthState({
          login: vi.fn().mockRejectedValue({
            isAxiosError: true,
            response: { data: { message: 'Bad credentials' } },
          }),
        }),
      },
    });

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);

    await user.type(emailInput, 'peter@me.com');
    await user.type(passwordInput, 'mysecretpassword123!');
    await user.click(await screen.findByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/bad credentials/i);
  });
  it('should test a valid login attempt', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/login?redirect=%2Fabout',
    });

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);

    await user.type(emailInput, 'peter@me.com');
    await user.type(passwordInput, 'mysecretpassword123!');
    await user.click(await screen.findByRole('button', { name: /log in/i }));
    expect(await screen.findByText('Hello "/about"!')).toBeInTheDocument();
  });
  it('should test submit button is disabled when invalid email is entered', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/login',
    });

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    await user.type(emailInput, 'notanemail');

    expect(await screen.findByRole('button', { name: /log in/i })).toBeDisabled();
  });
  it('should test submit button is enabled when valid input is entered', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/login',
    });

    const button = await screen.findByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
    await user.type(await screen.findByRole('textbox', { name: /email/i }), 'myemail@gmail.com');
    await user.type(await screen.findByLabelText(/password/i), 'mysecretpassword123!');
    expect(button).not.toBeDisabled();
  });
  it('should test visiting login with isAuthenticated true redirects', async () => {
    renderWithFileRoutes({
      initialLocation: '/login?redirect=%2Fabout',
      routerContext: {
        auth: createMockAuthState({ isAuthenticated: true }),
      },
    });
    expect(await screen.findByText('Hello "/about"!')).toBeInTheDocument();
  });
  it('should fall back to a generic message when the error has no response body', async () => {
    const user = userEvent.setup();
    renderWithFileRoutes({
      initialLocation: '/login',
      routerContext: {
        auth: createMockAuthState({
          login: vi.fn().mockRejectedValue(new Error('Network Error')),
        }),
      },
    });

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);

    await user.type(emailInput, 'peter@me.com');
    await user.type(passwordInput, 'somepassword');
    await user.click(await screen.findByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i);
  });
  it('should replace a previous error when the user retries and fails again', async () => {
    const user = userEvent.setup();
    const login = vi
      .fn()
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { message: 'Bad credentials' } },
      })
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { message: 'Account locked' } },
      });

    renderWithFileRoutes({
      initialLocation: '/login',
      routerContext: {
        auth: createMockAuthState({ login }),
      },
    });

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);
    const button = await screen.findByRole('button', { name: /log in/i });

    await user.type(emailInput, 'peter@me.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent(/bad credentials/i);

    await user.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent(/account locked/i);
    expect(screen.queryByText(/bad credentials/i)).not.toBeInTheDocument();
  });
});
