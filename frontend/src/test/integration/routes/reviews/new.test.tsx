import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import {
  useCategoriesWithSystemNotesSuspense,
  type CategoryNoteResponseModel,
  type ReviewResponseModel,
} from '../../../../api/generated/reviews-api';
import { customReviewsInstance } from '../../../../api/axios-instance';
import {
  useUserBottlesSuspense,
  type BottleResponseModel,
} from '../../../../api/generated/bottles-api';

function renderNewReviewRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/reviews/new?bottleId=',
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
  const reviewSetting = await screen.findByRole('textbox', {
    name: /review setting/i,
  });
  const reviewDate = await screen.findByLabelText(/review date/i);
  const restTime = await screen.findByRole('spinbutton', {
    name: /^rest time/i,
  });
  const glassware = await screen.findByRole('textbox', { name: /glassware/i });
  const nose = await screen.findByRole('textbox', { name: /^nose/i });
  const palate = await screen.findByRole('textbox', { name: /^palate/i });
  const finish = await screen.findByRole('textbox', { name: /^finish/i });
  const thoughts = await screen.findByRole('textbox', { name: /thoughts/i });
  const value = await screen.findByRole('spinbutton', {
    name: /value rating/i,
  });
  const overall = await screen.findByRole('spinbutton', {
    name: /overall rating/i,
  });
  const submitButton = await screen.findByRole('button', {
    name: /save review/i,
  });

  return {
    reviewSetting,
    reviewDate,
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
    bottleId: '12345',
    setting: 'Test setting',
    reviewDate: '',
    restTimeMin: 15,
    glassware: 'Test glassware',
    nose: 'Test nose notes',
    palate: 'Test palate notes',
    finish: 'Test finish notes',
    thoughts: 'Test final thoughts',
    valueScore: 8,
    overallRating: 8,
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

function returnUserBottlesResponse(): (BottleResponseModel & { id: string })[] {
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
    customBottlesInstance: vi.fn().mockResolvedValue([{ id: '12345', ...returnBottleResponse() }]),
  };
});

vi.mock('../../../../api/generated/reviews-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/generated/reviews-api')>();

  return {
    ...actual,
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

describe('New review route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('shows the form elements', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const bottleCombobox = await screen.findByRole('combobox');

    expect(bottleCombobox).toBeInTheDocument();
    expect(selectors.reviewSetting).toBeInTheDocument();
    expect(selectors.reviewDate).toBeInTheDocument();
    expect(selectors.restTime).toBeInTheDocument();
    expect(selectors.glassware).toBeInTheDocument();
    expect(selectors.nose).toBeInTheDocument();
    expect(selectors.palate).toBeInTheDocument();
    expect(selectors.finish).toBeInTheDocument();
    expect(selectors.thoughts).toBeInTheDocument();
    expect(selectors.value).toBeInTheDocument();
    expect(selectors.overall).toBeInTheDocument();
  });
  it('allows submitting the form', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);
    // The route loader's own GET /notes/categories call also goes through
    // this mock, so clear its call history before asserting on submit-time calls.
    mockedCustomReviewInstance.mockClear();

    const bottleCombobox = await screen.findByRole('combobox');
    await user.click(bottleCombobox);
    await user.click(await screen.findByRole('option', { name: /test bottle/i }));

    await user.type(selectors.reviewSetting, 'Test setting');
    await user.type(selectors.reviewDate, '2026-08-10');
    await user.type(selectors.restTime, '15');
    await user.type(selectors.glassware, 'Test glassware');
    await user.type(selectors.nose, 'Test nose notes');
    await user.type(selectors.palate, 'Test palate notes');
    await user.type(selectors.finish, 'Test finish notes');
    await user.type(selectors.thoughts, 'Test final thoughts');
    await user.type(selectors.value, '8');
    await user.type(selectors.overall, '8');

    await user.click(await screen.findByRole('button', { name: /^spicy$/i }));
    await user.click(await screen.findByRole('button', { name: /^pepper$/i, pressed: false }));

    await user.click(await screen.findByRole('button', { name: /^sweet$/i }));
    await user.click(
      await screen.findByRole('button', { name: /^butterscotch$/i, pressed: false }),
    );
    const butterscotchScore = await screen.findByRole('spinbutton', {
      name: /butterscotch score/i,
    });
    await user.clear(butterscotchScore);
    await user.type(butterscotchScore, '8');

    await user.click(selectors.submitButton);

    const { reviewNotes: _reviewNotes, ...reviewWithoutNotes } = returnReviewResponse();

    expect(mockedCustomReviewInstance).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'POST',
        url: '/reviews/new',
        data: reviewWithoutNotes,
      }),
    );

    expect(mockedCustomReviewInstance).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: 'POST',
        url: '/reviews/12345/notes',
        data: [
          { categoryId: '654', name: 'pepper', score: 5 },
          { categoryId: '456', name: 'butterscotch', score: 8 },
        ],
      }),
    );

    expect(mockedCustomReviewInstance).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: 'GET',
        url: '/reviews/12345',
      }),
    );

    expect(await screen.findByText(/test setting/i)).toBeInTheDocument();
  });
  it('shows the backend error message on a failed created', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);

    mockedCustomReviewInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not create review' } },
    });

    const bottleCombobox = await screen.findByRole('combobox');
    await user.click(bottleCombobox);
    await user.click(await screen.findByRole('option', { name: /test bottle/i }));
    await user.type(selectors.reviewSetting, 'Test setting');
    await user.type(selectors.restTime, '15');
    await user.type(selectors.glassware, 'Test glassware');
    await user.type(selectors.nose, 'Test nose notes');
    await user.type(selectors.palate, 'Test palate notes');
    await user.type(selectors.finish, 'Test finish notes');
    await user.type(selectors.thoughts, 'Test final thoughts');
    await user.type(selectors.value, '8');
    await user.type(selectors.overall, '8');
    await user.tab();
    await waitFor(() => expect(selectors.submitButton).not.toBeDisabled());
    await user.click(selectors.submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not create review/i);
  });
  it('shows client-side validation', async () => {
    vi.mocked(useCategoriesWithSystemNotesSuspense).mockReturnValue({
      data: returnCategoriesWithSystemNotesResponse(),
    } as ReturnType<typeof useCategoriesWithSystemNotesSuspense>);

    vi.mocked(useUserBottlesSuspense).mockReturnValue({
      data: returnUserBottlesResponse(),
    } as ReturnType<typeof useUserBottlesSuspense>);

    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.click(selectors.submitButton);
    expect(within(selectors.reviewSetting.closest('div')!).getByRole('alert')).toHaveTextContent(
      /setting is required/i,
    );

    expect(within(selectors.glassware.closest('div')!).getByRole('alert')).toHaveTextContent(
      /glassware is required/i,
    );

    expect(within(selectors.nose.closest('div')!).getByRole('alert')).toHaveTextContent(
      /please provide a value for nose/i,
    );

    expect(within(selectors.palate.closest('div')!).getByRole('alert')).toHaveTextContent(
      /please provide a value for palate/i,
    );

    expect(within(selectors.finish.closest('div')!).getByRole('alert')).toHaveTextContent(
      /please provide a value for finish/i,
    );

    expect(within(selectors.thoughts.closest('div')!).getByRole('alert')).toHaveTextContent(
      /please provide a value for thoughts/i,
    );
  });
});
