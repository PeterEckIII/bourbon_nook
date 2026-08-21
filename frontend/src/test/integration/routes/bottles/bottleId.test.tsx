import { describe, it, expect, vi, beforeEach, beforeAll } from 'vite-plus/test';
import { screen, waitFor } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import type { BottleResponseModel } from '../../../../api/generated/bottles-api';
import userEvent from '@testing-library/user-event';
import { customBottlesInstance } from '../../../../api/axios-instance';

function returnBottleResponse(): BottleResponseModel {
  return {
    id: 'abc555',
    name: 'Mock Bottle',
    type: 'Bourbon',
    status: 'OPENED',
    distillery: 'Mock Distillery',
    producer: 'Mock Producer',
    country: 'USA',
    region: 'KY',
    price: 25.99,
    age: 'NAS',
    proof: 115.2,
    releaseYear: 2026,
    barrelInformation: 'N/A',
    finishing: 'N/A',
    imageUrl:
      'https://bourbon-nook.s3.amazonaws.com/8d617ebd-1ccd-45e3-876f-13df82cfe8c3/e89ae702-cfbc-475b-8ba4-8c6b3d4cb1f7-wtmk%20beacon.webp',
    openDate: '2026-07-29',
    killDate: undefined,
  };
}

function renderBottleIdRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/bottles/abc555',
    routerContext: {
      auth: createMockAuthState({
        user: {
          id: '123abc',
          email: 'test@email.com',
          username: 'testuser',
          roles: ['ROLE_USER'],
        },
        isAuthenticated: true,
      }),
    },
  });
}

async function getSelectors() {
  const pageTitle = await screen.findByText(/mock bottle/i);
  const status = await screen.findByText(/opened/i);
  const price = await screen.findByText(/25.99/i);
  const writeReviewLink = await screen.findByRole('link', {
    name: /write review/i,
  });
  const editBottleLink = await screen.findByRole('link', {
    name: /edit bottle/i,
  });
  const deleteBottleButton = await screen.findByRole('button', {
    name: /delete bottle/i,
  });
  const bottleImage = await screen.findByRole('img');

  return {
    pageTitle,
    status,
    price,
    writeReviewLink,
    editBottleLink,
    deleteBottleButton,
    bottleImage,
  };
}

vi.mock('../../../../api/axios-instance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/axios-instance')>();

  const bottleResponse = returnBottleResponse();

  return {
    ...actual,
    customBottlesInstance: vi.fn().mockResolvedValue(bottleResponse),
  };
});

describe('Bottle ID route', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.defineHelper(function (this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
    });
  });
  beforeEach(() => vi.clearAllMocks());
  it('renders the route and displays elements', async () => {
    renderBottleIdRouteWithAuth();
    const selectors = await getSelectors();
    expect(selectors.pageTitle).toBeInTheDocument();
    expect(selectors.status).toBeInTheDocument();
    expect(selectors.price).toBeInTheDocument();
    const params = new URLSearchParams();
    params.set('bottleId', 'abc555');
    expect(selectors.writeReviewLink).toHaveAttribute('href', `/reviews/new?${params.toString()}`);
    expect(selectors.editBottleLink).toHaveAttribute('href', '/bottles/abc555/edit');
    expect(selectors.deleteBottleButton).toBeInTheDocument();
    expect(selectors.bottleImage).toHaveAttribute(
      'src',
      'https://bourbon-nook.s3.amazonaws.com/8d617ebd-1ccd-45e3-876f-13df82cfe8c3/e89ae702-cfbc-475b-8ba4-8c6b3d4cb1f7-wtmk%20beacon.webp',
    );
  });
  it('allows deleting a bottle', async () => {
    const { router } = renderBottleIdRouteWithAuth();
    const { deleteBottleButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedBottleInstance = vi.mocked(customBottlesInstance);

    await user.click(deleteBottleButton);
    expect(await screen.findByText(/delete this bottle\?/i)).toBeInTheDocument();
    const confirmButton = await screen.findByRole('button', {
      name: /^delete$/i,
    });
    await user.click(confirmButton);

    expect(mockedBottleInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: '/bottles/abc555',
      }),
    );
    await waitFor(() => expect(router.state.location.pathname).toBe('/bottles'));
  });
  it('cancels the delete flow when pressing cancel', async () => {
    const { router } = renderBottleIdRouteWithAuth();
    const { deleteBottleButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedBottleInstance = vi.mocked(customBottlesInstance);

    await user.click(deleteBottleButton);
    expect(await screen.findByText(/delete this bottle\?/i)).toBeInTheDocument();
    const cancelButton = await screen.findByRole('button', {
      name: /^cancel$/i,
    });
    await user.click(cancelButton);

    expect(mockedBottleInstance).not.toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE' }),
    );
    await waitFor(() => expect(router.state.location.pathname).toBe('/bottles/abc555'));
  });
  it('shows an error when delete fails', async () => {
    renderBottleIdRouteWithAuth();
    const { deleteBottleButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedBottleInstance = vi.mocked(customBottlesInstance);

    mockedBottleInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not delete bottle with ID abc555' } },
    });

    await user.click(deleteBottleButton);
    await user.click(await screen.findByRole('button', { name: /^delete$/i }));

    expect(await screen.getByRole('alert')).toHaveTextContent(
      /could not delete bottle with id abc555/i,
    );
  });
  it('shows the missing image fallback when imageURL is undefined', async () => {
    const mockedBottleInstance = vi.mocked(customBottlesInstance);

    mockedBottleInstance.mockResolvedValue({
      ...returnBottleResponse(),
      imageUrl: undefined,
    });

    renderBottleIdRouteWithAuth();
    const { bottleImage } = await getSelectors();

    expect(bottleImage).toHaveAttribute('src', '/src/assets/brand/png/bottle-cancel-1024.png');
  });
  it('shows detail component fallback when data is undefined', async () => {
    const mockedBottleInstance = vi.mocked(customBottlesInstance);

    mockedBottleInstance.mockResolvedValue({
      ...returnBottleResponse(),
      openDate: undefined,
    });

    renderBottleIdRouteWithAuth();
    const openDate = await screen.findByText(/open date/i);

    expect(openDate.nextElementSibling).toHaveTextContent('—');
  });
});
