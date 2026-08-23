import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import {
  useCategoriesWithSystemNotesSuspense,
  useReviewSuspense,
  type CategoryNoteResponseModel,
  type ReviewResponseModel,
} from '../../../../api/generated/reviews-api';
import { customReviewsInstance } from '../../../../api/axios-instance';
import {
  useUserBottlesSuspense,
  type BottleResponseModel,
} from '../../../../api/generated/bottles-api';

function renderEditReviewRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/reviews/12345/edit',
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
  const bottle = await screen.findByRole('combobox');
  const setting = await screen.findByRole('textbox', { name: /review setting/i });
  const date = await screen.findByLabelText(/^review date/i);
  const restTime = await screen.findByRole('spinbutton', { name: /rest time/i });
  const glassware = await screen.findByRole('textbox', { name: /glassware/i });
  const nose = await screen.findByRole('textbox', { name: /nose/i });
  const palate = await screen.findByRole('textbox', { name: /palate/i });
  const finish = await screen.findByRole('textbox', { name: /finish/i });
  const thoughts = await screen.findByRole('textbox', { name: /thoughts/i });
  const value = await screen.findByRole('spinbutton', { name: /value rating/i });
  const overall = await screen.findByRole('spinbutton', { name: /overall rating/i });
  const submitButton = await screen.findByRole('button', {
    name: /save review/i,
  });

  return {
    bottle,
    setting,
    date,
    restTime,
    glassware,
    nose,
    palate,
    finish,
    thoughts,
    value,
    overall,
    submitButton,
  };
}

function returnReviewResponse(): ReviewResponseModel {
  return {
    bottleId: '555efg',
    setting: 'A fun setting',
    reviewDate: '2026-08-19',
    restTimeMin: 10,
    glassware: 'Glencairn',
    nose: 'Some funky notes on the nose',
    palate: 'A punchy, flavorful palate',
    finish: 'Long, drying, and full of cherry',
    thoughts: 'What an exceptional bourbon',
    valueScore: 8,
    overallRating: 7.5,
    reviewNotes: [
      {
        noteId: '123',
        noteName: 'pepper',
        categoryId: '456',
        categoryName: 'spicy',
        score: 5,
      },
      {
        noteId: '321',
        noteName: 'butterscotch',
        categoryId: '654',
        categoryName: 'sweet',
        score: 8,
      },
    ],
  };
}

function returnBottleResponse(): BottleResponseModel {
  return {
    name: 'Test bottle',
    type: 'Bourbon',
    status: 'SEALED',
    distillery: 'Test distillery',
    producer: 'Test producer',
    country: 'Test country',
    region: 'Test region',
    price: 25.99,
    age: 'NAS',
    proof: 100,
    releaseYear: 2025,
    barrelInformation: 'N/A',
    finishing: 'N/A',
    imageUrl: '',
    openDate: undefined,
    killDate: undefined,
  };
}

function returnCategoriesWithSystemNotesResponse(): CategoryNoteResponseModel[] {
  return [
    {
      id: '456',
      name: 'sweet',
      systemNotes: [
        { id: '555', name: 'butterscotch' },
        { id: '666', name: 'caramel' },
        { id: '777', name: 'chocolate' },
      ],
    },
    {
      id: '654',
      name: 'spicy',
      systemNotes: [
        { id: '888', name: 'pepper' },
        { id: '999', name: 'caraway' },
        { id: '000', name: 'cardamon' },
      ],
    },
  ];
}

function returnUserBottlesResponse(): BottleResponseModel[] {
  return [
    {
      id: '12345',
      name: 'Test bottle',
      type: 'Bourbon',
      status: 'SEALED',
      distillery: 'Test distillery',
      producer: 'Test producer',
      country: 'Test country',
      region: 'Test region',
      price: 25.99,
      age: 'NAS',
      proof: 100,
      releaseYear: 2025,
      barrelInformation: 'N/A',
      finishing: 'N/A',
      imageUrl: '',
      openDate: undefined,
      killDate: undefined,
    },
  ];
}

vi.mock('../../../../api/axios-instance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/axios-instance')>();

  return {
    ...actual,
    customReviewsInstance: vi.fn((config: { method?: string; url?: string }) => {
      if (config.method === 'GET' && config.url === '/notes/categories') {
        return Promise.resolve(returnCategoriesWithSystemNotesResponse());
      }
      return Promise.resolve({ id: '12345', ...returnReviewResponse() });
    }),
    customBottlesInstance: vi.fn().mockResolvedValue([{ id: '555efg', ...returnBottleResponse() }]),
  };
});

vi.mock('../../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/reviews-api')>();

  return {
    ...actual,
    useReviewSuspense: vi.fn(),
    useCategoriesWithSystemNotesSuspense: vi.fn(),
  };
});

vi.mock('../../../../api/generated/bottles-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/bottles-api')>();

  return {
    ...actual,
    useUserBottlesSuspense: vi.fn(),
  };
});

describe('Edit review route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('shows the form elements with default values', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    vi.mocked(useReviewSuspense).mockReturnValue({
      data: returnReviewResponse(),
    } as ReturnType<typeof useReviewSuspense>);

    renderEditReviewRouteWithAuth();
    const selectors = await getSelectors();

    expect(selectors.bottle).toBeInTheDocument();
    expect(selectors.setting).toHaveValue('A fun setting');
    expect(selectors.date).toBeInTheDocument();
    expect(selectors.restTime).toHaveValue(10);
    expect(selectors.glassware).toHaveValue('Glencairn');
    expect(selectors.nose).toHaveValue('Some funky notes on the nose');
    expect(selectors.palate).toHaveValue('A punchy, flavorful palate');
    expect(selectors.finish).toHaveValue('Long, drying, and full of cherry');
    expect(selectors.thoughts).toHaveValue('What an exceptional bourbon');
    expect(selectors.value).toHaveValue(8);
    expect(selectors.overall).toHaveValue(7.5);
    expect(selectors.submitButton).toBeInTheDocument();
  });
  it('allows editing the fields and submitting the form', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    vi.mocked(useReviewSuspense).mockReturnValue({
      data: returnReviewResponse(),
    } as ReturnType<typeof useReviewSuspense>);

    const { router } = renderEditReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);

    await user.clear(selectors.setting);
    await user.type(selectors.setting, 'Some new setting');

    await user.clear(selectors.restTime);
    await user.type(selectors.restTime, '15');

    await user.clear(selectors.nose);
    await user.type(selectors.nose, 'My new nose notes');

    await waitFor(() => expect(selectors.submitButton).not.toBeDisabled(), { timeout: 2000 });

    await user.click(selectors.submitButton);

    const { reviewNotes: _reviewNotes, ...reviewWithoutNotes } = returnReviewResponse();

    expect(mockedCustomReviewInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: '/reviews/12345',
        data: {
          ...reviewWithoutNotes,
          setting: 'Some new setting',
          restTimeMin: 15,
          nose: 'My new nose notes',
        },
      }),
    );
    expect(router.state.location.pathname).toBe('/reviews/12345');
    expect(await screen.findByText('Overall Rating')).toBeInTheDocument();
  });
  it('shows the backend error message on a failed edit', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    vi.mocked(useReviewSuspense).mockReturnValue({
      data: returnReviewResponse(),
    } as ReturnType<typeof useReviewSuspense>);

    renderEditReviewRouteWithAuth();
    const { submitButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);

    mockedCustomReviewInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not save your edits' } },
    });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not save your edits/i);
  });
  it('shows client-side validation', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    vi.mocked(useReviewSuspense).mockReturnValue({
      data: returnReviewResponse(),
    } as ReturnType<typeof useReviewSuspense>);

    renderEditReviewRouteWithAuth();
    const user = userEvent.setup();
    const { setting } = await getSelectors();

    await user.clear(setting);
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(/setting is required/i);

    await user.type(setting, 'Finally a real setting');
    await user.tab();
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
