import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import {
  getGetUserQueryKey,
  updateUser,
  useGetUserSuspense,
  type UserResponseModel,
} from '../../../api/generated/users-api';
import userEvent from '@testing-library/user-event';

const mockUser: UserResponseModel = {
  userId: '456efj',
  email: 'newuser@gmail.com',
  username: 'myusername',
  roles: ['ROLE_USER'],
};

function renderAdminUsersPageWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/admin/users/456efj/edit',
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
}

vi.mock('../../../api/generated/users-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/generated/users-api')>();

  return {
    ...actual,
    getGetUserQueryOptions: () => ({
      queryKey: getGetUserQueryKey('456efj'),
      queryFn: () => Promise.resolve(mockUser),
    }),
    useGetUserSuspense: vi.fn(),
    updateUser: vi.fn(),
  };
});

describe('Edit user route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetUserSuspense).mockReturnValue({
      data: mockUser,
    } as ReturnType<typeof useGetUserSuspense>);
  });
  it('renders the form components correctly', async () => {
    renderAdminUsersPageWithAuth();

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const usernameInput = await screen.findByRole('textbox', { name: /username/i });
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Edit User 456efj');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('newuser@gmail.com');
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toHaveValue('myusername');
    expect(await screen.findByRole('button', { name: /update user/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /back to users/i })).toHaveAttribute(
      'href',
      '/admin/users',
    );
  });
  it('handles interacting with the form and form submission', async () => {
    const { router } = renderAdminUsersPageWithAuth();
    const user = userEvent.setup();
    vi.mocked(updateUser).mockReturnValueOnce({} as ReturnType<typeof updateUser>);

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const usernameInput = await screen.findByRole('textbox', { name: /username/i });

    await user.clear(emailInput);
    await user.type(emailInput, 'mynewemail@gmail.com');
    expect(emailInput).toHaveValue('mynewemail@gmail.com');

    await user.clear(usernameInput);
    await user.type(usernameInput, 'flyguy50');
    expect(usernameInput).toHaveValue('flyguy50');

    await user.click(await screen.findByRole('button', { name: /update user/i }));

    expect(updateUser).toHaveBeenCalledWith('456efj', {
      email: 'mynewemail@gmail.com',
      username: 'flyguy50',
    });
    expect(router.state.location.pathname).toBe('/admin/users');
  });
  it('handles server error when updateUser fails', async () => {
    const { router } = renderAdminUsersPageWithAuth();
    vi.mocked(updateUser).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Email already in use' } },
    });
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /update user/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/email already in use/i);
    expect(router.state.location.pathname).toBe('/admin/users/456efj/edit');
  });
  it('handles client-side validation', async () => {
    renderAdminUsersPageWithAuth();
    const user = userEvent.setup();

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const usernameInput = await screen.findByRole('textbox', { name: /username/i });

    await user.clear(emailInput);
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /please enter a valid email address/i,
    );
    await user.type(emailInput, 'myemail@gmail.com');
    await user.tab();
    expect(await screen.queryByRole('alert')).toBeNull();

    await user.clear(usernameInput);
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /username must be at least 3 characters/i,
    );

    await user.type(usernameInput, 'mynewusername');
    await user.tab();
    expect(await screen.queryByRole('alert')).toBeNull();
  });
  it('redirects to /unauthorized if the user is not an admin', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/users/456efj/edit',
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
    expect(router.state.location.pathname).toBe('/unauthorized');
    expect(router.state.location.search.reason).toBe('insufficient_role');
  });
  it('redirects to /login if the user is not authenticated', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/users/456efj/edit',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: false,
          hasRole: vi.fn((role: string) => ['ROLE_USER'].includes(role)),
        }),
      },
    });

    expect(
      await screen.findByRole('heading', { level: 1, name: /log in to bourbonnook/i }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toEqual({ redirect: '/admin/users/456efj/edit' });
  });
});
