import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import {
  getGetUsersQueryKey,
  useDeleteUser,
  useGetUsersSuspense,
  type UserResponseModel,
} from '../../../api/generated/users-api';
import userEvent from '@testing-library/user-event';

const mockUsers: UserResponseModel[] = [
  {
    userId: '123abc',
    email: 'test@user.com',
    username: 'testuser',
    roles: ['ROLE_USER'],
  },
  {
    userId: '456efg',
    email: 'test2@user.com',
    username: 'newuser',
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
  },
];

function renderAdminUsersPageWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/admin/users',
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
    getGetUsersQueryOptions: () => ({
      queryKey: getGetUsersQueryKey(),
      queryFn: () => Promise.resolve(mockUsers),
    }),
    useGetUsersSuspense: vi.fn(),
    useDeleteUser: vi.fn(),
  };
});

describe('Admin users route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetUsersSuspense).mockReturnValue({
      data: mockUsers,
    } as ReturnType<typeof useGetUsersSuspense>);
    vi.mocked(useDeleteUser).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteUser>);
  });
  it('renders the users route with table, headings, and links', async () => {
    renderAdminUsersPageWithAuth();
    expect(await screen.findByRole('heading', { level: 1, name: /users/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /← back to admin dashboard/i })).toHaveAttribute(
      'href',
      '/admin/dashboard',
    );
    expect(await screen.findByRole('table')).toBeInTheDocument();
    expect(await screen.findByText('test@user.com')).toBeInTheDocument();
    const row = (await screen.findByText('test@user.com')).closest('tr');
    const editLink = within(row!).getByRole('link', { name: /edit user/i });
    expect(editLink).toHaveAttribute('href', '/admin/users/123abc/edit');
  });
  it('renders an empty table if there are no users', async () => {
    vi.mocked(useGetUsersSuspense).mockReturnValueOnce({
      data: [],
    } as ReturnType<typeof useGetUsersSuspense>);
    renderAdminUsersPageWithAuth();
    expect(await screen.findByText(/no users/i)).toBeInTheDocument();
  });
  it('redirects to the /unauthorized route if the user is not an admin', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/admin/users',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: true,
          hasRole: (role: string) => ['ROLE_USER'].includes(role),
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
      initialLocation: '/admin/users',
      routerContext: {
        auth: createMockAuthState({
          user: {
            id: '123abc',
            email: 'test@user.com',
            username: 'testuser',
            roles: ['ROLE_USER'],
          },
          isAuthenticated: false,
          hasRole: (role: string) => ['ROLE_USER'].includes(role),
        }),
      },
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: /log in to bourbonnook/i }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toEqual({ redirect: '/admin/users' });
  });
  it('handles the edit flow correctly', async () => {
    const { router } = renderAdminUsersPageWithAuth();
    const user = userEvent.setup();

    const row = (await screen.findByText('test@user.com')).closest('tr');
    const editLink = within(row!).getByRole('link', { name: /edit user/i });
    await user.click(editLink);

    expect(router.state.location.pathname).toBe('/admin/users/123abc/edit');
  });
  it('handles the delete user flow correctly', async () => {
    renderAdminUsersPageWithAuth();
    const user = userEvent.setup();
    const mockDeleteMutate = vi.fn();
    vi.mocked(useDeleteUser).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteUser>);

    const row = (await screen.findByText('test@user.com')).closest('tr');
    const deleteButton = within(row!).getByRole('button', { name: /delete user/i });
    await user.click(deleteButton);

    expect(await screen.findByRole('heading', { name: /delete this user\?/i })).toBeInTheDocument();

    const cancelButton = await screen.findByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    await user.click(cancelButton);
    expect(await screen.queryByRole('button', { name: /cancel/i })).toBeNull();
    expect(mockDeleteMutate).not.toHaveBeenCalled();

    await user.click(deleteButton);
    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[1]);
    expect(mockDeleteMutate).toHaveBeenCalledTimes(1);
    expect(mockDeleteMutate).toHaveBeenCalledWith({ id: '123abc' });
  });
});
