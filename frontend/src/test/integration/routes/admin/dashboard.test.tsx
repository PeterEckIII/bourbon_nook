import { describe, it, expect, vi } from 'vite-plus/test';
import { screen, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';

describe('Admin dashboard route', () => {
  it('renders the dashboard components', async () => {
    renderWithFileRoutes({
      initialLocation: '/admin/dashboard',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_ADMIN', 'ROLE_USER'],
          },
          isAuthenticated: true,
          hasRole: vi.fn((role: string) => ['ROLE_ADMIN', 'ROLE_USER'].includes(role)),
        }),
      },
    });
    expect(await screen.findByText(/admin area/i)).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 1, name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 2, name: /user management/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 2, name: /system settings/i }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /view users/i })).toHaveAttribute(
      'href',
      '/admin/users',
    );
    expect(await screen.findByRole('link', { name: /open settings/i })).toHaveAttribute(
      'href',
      '/admin/system-settings',
    );
    const userInfoHeader = (await screen.findByRole('heading', { level: 3, name: /your info/i }))
      .parentElement;
    expect(userInfoHeader).toBeInTheDocument();
    const userInfoParagraphs = await within(userInfoHeader!).findAllByRole('paragraph');

    expect(userInfoParagraphs[0]).toHaveTextContent(/username: testuser/i);
    expect(userInfoParagraphs[1]).toHaveTextContent(/roles: ROLE_ADMIN, ROLE_USER/i);
  });
  it('directs to the unauthorized route if the user is not an admin', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/dashboard',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: true,
          hasRole: vi.fn((role: string) => ['ROLE_USER'].includes(role)),
        }),
      },
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: /access denied/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/role_user/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /go to dashboard/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /try again/i })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/unauthorized');
    expect(router.state.location.search.reason).toBe('insufficient_role');
  });
  it('ensures user with just admin rights can access', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/dashboard',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_ADMIN'],
          },
          isAuthenticated: true,
          hasRole: vi.fn((role: string) => ['ROLE_ADMIN'].includes(role)),
        }),
      },
    });
    expect(await screen.findByText(/admin area/i)).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { level: 1, name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/admin/dashboard');
  });
  it('redirects when the user is not authenticated', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/dashboard',
      routerContext: {
        auth: createMockAuthState({
          user: null,
          isAuthenticated: false,
        }),
      },
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: /log in to bourbonnook/i }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toEqual({
      redirect: '/admin/dashboard',
    });
  });
});
