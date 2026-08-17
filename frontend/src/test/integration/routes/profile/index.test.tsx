import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import {
  getFollowersQueryOptions,
  getFollowingQueryOptions,
  useDeleteAccount,
  useFollowersSuspense,
  useFollowingSuspense,
  useMeSuspense,
  type PageUserSummaryDto,
} from '../../../../api/generated/users-api';
import type { User } from '../../../../auth/types';
import { useCountBottlesSuspense } from '../../../../api/generated/bottles-api';
import { useCountReviewsSuspense } from '../../../../api/generated/reviews-api';
import userEvent from '@testing-library/user-event';

const mockUser: User = {
  id: '123abc',
  email: 'test@email.com',
  username: 'testuser',
  roles: ['ROLE_USER'],
};

const mockFollowersResponse: PageUserSummaryDto = {
  totalPages: 1,
  totalElements: 4,
  numberOfElements: 4,
  first: true,
  last: false,
  content: [
    {
      userId: '555',
      username: 'user1',
    },
    {
      userId: '777',
      username: 'user2',
    },
    {
      userId: '888',
      username: 'user3',
    },
    {
      userId: '999',
      username: 'user4',
    },
  ],
  empty: false,
};

const mockFollowingResponse: PageUserSummaryDto = {
  totalPages: 1,
  totalElements: 2,
  numberOfElements: 2,
  first: true,
  last: false,
  content: [
    {
      userId: '111',
      username: 'following111',
    },
    {
      userId: '222',
      username: 'following222',
    },
  ],
  empty: false,
};

const mockEmptyFollowersResponse: PageUserSummaryDto = {
  ...mockFollowersResponse,
  totalElements: undefined,
  content: [],
};

const mockEmptyFollowingResponse: PageUserSummaryDto = {
  ...mockFollowingResponse,
  totalElements: undefined,
  content: [],
};

vi.mock('../../../../api/generated/users-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/users-api')>();

  return {
    ...actual,
    getMeQueryOptions: () => ({
      queryKey: actual.getMeQueryKey(),
      queryFn: () => Promise.resolve(mockUser),
    }),
    getFollowersQueryOptions: vi.fn((userId: string) => ({
      queryKey: actual.getFollowersQueryKey(userId),
      queryFn: () => Promise.resolve(mockFollowersResponse),
    })),
    getFollowingQueryOptions: vi.fn((userId: string) => ({
      queryKey: actual.getFollowingQueryKey(userId),
      queryFn: () => Promise.resolve(mockFollowingResponse),
    })),
    useMeSuspense: vi.fn(),
    useFollowersSuspense: vi.fn(),
    useFollowingSuspense: vi.fn(),
    useDeleteAccount: vi.fn(),
  };
});

vi.mock('../../../../api/generated/bottles-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/bottles-api')>();
  return {
    ...actual,
    getCountBottlesQueryOptions: () => ({
      queryKey: actual.getCountBottlesQueryKey(),
      queryFn: () => Promise.resolve(5),
    }),
    useCountBottlesSuspense: vi.fn(),
  };
});

vi.mock('../../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/reviews-api')>();
  return {
    ...actual,
    getCountReviewsQueryOptions: () => ({
      queryKey: actual.getCountReviewsQueryKey(),
      queryFn: () => Promise.resolve(3),
    }),
    useCountReviewsSuspense: vi.fn(),
  };
});

function renderProfileRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/profile',
    routerContext: {
      auth: createMockAuthState({
        user: mockUser,
        isAuthenticated: true,
      }),
    },
  });
}

async function getSelectors() {
  const username = await screen.findByRole('heading', { level: 1 });
  const changePasswordLink = await screen.findByRole('link', { name: /change password/i });

  const bottleCount = await screen.findByText('5');
  const reviewCount = await screen.findByText('3');
  const followerCount = await screen.findByText('4');
  const followingCount = await screen.findByText('2');

  const followersSection = (
    await screen.findByRole('heading', { level: 2, name: /followers/i })
  ).closest('section');

  const followingSection = (
    await screen.findByRole('heading', { level: 2, name: /following/i })
  ).closest('section');

  const dangerZoneHeading = await screen.findByRole('heading', { level: 2, name: /danger zone/i });
  const deleteAccountButton = await screen.findByRole('button', { name: /delete account/i });

  return {
    username,
    changePasswordLink,
    bottleCount,
    reviewCount,
    followerCount,
    followingCount,
    followersSection,
    followingSection,
    dangerZoneHeading,
    deleteAccountButton,
  };
}

describe('Profile index route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMeSuspense).mockReturnValue({
      data: mockUser,
    } as ReturnType<typeof useMeSuspense>);
    vi.mocked(useCountBottlesSuspense).mockReturnValue({
      data: 5,
    } as ReturnType<typeof useCountBottlesSuspense>);
    vi.mocked(useCountReviewsSuspense).mockReturnValue({
      data: 3,
    } as ReturnType<typeof useCountReviewsSuspense>);
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteAccount>);
  });
  it('shows the profile view components with non-empty data', async () => {
    // Mocks
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    // Setup
    renderProfileRouteWithAuth();
    const selectors = await getSelectors();

    // Counts
    expect(selectors.username).toHaveTextContent(/testuser/i);
    expect(selectors.changePasswordLink).toHaveAttribute('href', '/profile/change-password');
    expect(selectors.bottleCount).toBeInTheDocument();
    expect(selectors.reviewCount).toBeInTheDocument();
    expect(selectors.followerCount).toBeInTheDocument();
    expect(selectors.followingCount).toBeInTheDocument();

    // Followers
    expect(selectors.followersSection).toBeInTheDocument();
    const followersList = await screen.findByRole('list', { name: /followers/i });
    const followersListItems = await within(followersList).findAllByRole('listitem');
    expect(followersListItems).toHaveLength(4);

    // Following
    expect(selectors.followingSection).toBeInTheDocument();
    const followingList = await screen.findByRole('list', { name: /following/i });
    const followingListItems = await within(followingList).findAllByRole('listitem');
    expect(followingListItems).toHaveLength(2);

    // Danger zone
    expect(selectors.dangerZoneHeading).toBeInTheDocument();
    expect(selectors.deleteAccountButton).toBeInTheDocument();
  });
  it('shows fallback with empty follower/following data', async () => {
    // Mocks
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockEmptyFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockEmptyFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    // Setup
    renderProfileRouteWithAuth();

    expect(await screen.findByText(/no followers yet/i)).toBeInTheDocument();
    expect(await screen.findByText(/not following anyone yet/i)).toBeInTheDocument();
    // test for totalElements = 0
  });
  it('redirects to /login with isAuthenticated = false', async () => {
    const { router } = renderWithFileRoutes({
      initialLocation: '/profile',
      routerContext: {
        auth: createMockAuthState({
          user: null,
          isAuthenticated: false,
        }),
      },
    });

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(router.state.location.search).toEqual({ redirect: '/profile' });
  });
  it('allows interacting with delete account flow before submission', async () => {
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    renderProfileRouteWithAuth();
    const { deleteAccountButton } = await getSelectors();
    const user = userEvent.setup();
    await user.click(deleteAccountButton);
    expect(
      await screen.findByRole('heading', { level: 2, name: /delete your account/i }),
    ).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: /cancel/i }));
    expect(
      await screen.queryByRole('heading', { level: 2, name: /delete your account/i }),
    ).toBeNull();
  });
  it('allows deleting an account', async () => {
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    // Mock the mutation
    const mockMutate = vi.fn();
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteAccount>);

    // Setup
    renderProfileRouteWithAuth();
    const { deleteAccountButton } = await getSelectors();
    const user = userEvent.setup();

    // Interaction/assertion
    await user.click(deleteAccountButton);
    expect(
      await screen.findByRole('heading', { level: 2, name: /delete your account/i }),
    ).toBeInTheDocument();
    const passwordInput = await screen.findByLabelText(/type your password to confirm/i);
    await user.type(passwordInput, 'Password123$');

    const confirmDeleteButton = await screen.findByRole('button', { name: /^delete$/i });
    await user.click(confirmDeleteButton);
    expect(mockMutate).toHaveBeenCalledWith({
      data: { password: 'Password123$' },
    });
  });
  it('shows error when delete account fails', async () => {
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    const mockMutate = vi.fn();
    vi.mocked(useDeleteAccount).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: {
        isAxiosError: true,
        response: { data: { message: 'Wrong password' } },
      },
    } as unknown as ReturnType<typeof useDeleteAccount>);

    // Setup
    renderProfileRouteWithAuth();
    const { deleteAccountButton } = await getSelectors();
    const user = userEvent.setup();

    // Interaction/assertion
    await user.click(deleteAccountButton);
    expect(
      await screen.findByRole('heading', { level: 2, name: /delete your account/i }),
    ).toBeInTheDocument();
    const passwordInput = await screen.findByLabelText(/type your password to confirm/i);
    await user.type(passwordInput, 'Password123$');

    const confirmDeleteButton = await screen.findByRole('button', { name: /^delete$/i });
    await user.click(confirmDeleteButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/wrong password/i);
  });
  it('sends through the right userId', async () => {
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    renderProfileRouteWithAuth();
    await screen.findByRole('heading', { level: 1 });

    expect(getFollowersQueryOptions).toHaveBeenCalledWith('123abc', {
      pageable: { page: 1, size: 50 },
    });
    expect(getFollowingQueryOptions).toHaveBeenCalledWith('123abc', {
      pageable: { page: 1, size: 50 },
    });
  });
  it("renders the 'back to home' button correctly", async () => {
    vi.mocked(useFollowersSuspense).mockReturnValue({
      data: mockFollowersResponse,
    } as ReturnType<typeof useFollowersSuspense>);
    vi.mocked(useFollowingSuspense).mockReturnValue({
      data: mockFollowingResponse,
    } as ReturnType<typeof useFollowingSuspense>);

    // Setup
    renderProfileRouteWithAuth();
    const backToHomeLink = await screen.findByRole('link', { name: /← back to home/i });
    expect(backToHomeLink).toBeInTheDocument();
    expect(backToHomeLink).toHaveAttribute('href', '/');
  });
});
