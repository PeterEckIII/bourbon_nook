import { describe, it, expect } from 'vite-plus/test';
import { screen, waitFor, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import type { ReviewResponseModel } from '../../../api/generated/reviews-api';
import { customReviewsInstance } from '../../../api/axios-instance';
import type { BottleResponseModel } from '../../../api/generated/bottles-api';

function renderNewReviewRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/reviews/new',
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
  const bottleCombobox = await screen.findByRole('combobox');
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
    bottleCombobox,
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

vi.mock('../../../api/axios-instance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../api/axios-instance')>();

  return {
    ...actual,
    customReviewsInstance: vi.fn().mockResolvedValue({ id: '12345', ...returnReviewResponse() }),
    customBottlesInstance: vi.fn().mockResolvedValue([{ id: '12345', ...returnBottleResponse() }]),
  };
});

describe('New review route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('shows the form elements', async () => {
    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();

    expect(selectors.bottleCombobox).toBeInTheDocument();
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
    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);

    await user.click(selectors.bottleCombobox);
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

    await user.click(selectors.submitButton);

    expect(mockedCustomReviewInstance).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'POST',
        url: '/reviews/new',
        data: { ...returnReviewResponse() },
      }),
    );

    expect(mockedCustomReviewInstance).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: 'GET',
        url: '/reviews/12345',
      }),
    );

    expect(await screen.findByText(/test setting/i)).toBeInTheDocument();
  });
  it('shows the backend error message on a failed created', async () => {
    renderNewReviewRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomReviewInstance = vi.mocked(customReviewsInstance);

    mockedCustomReviewInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not create review' } },
    });

    await user.click(selectors.bottleCombobox);
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

    expect(await screen.getByRole('alert')).toHaveTextContent(/could not create review/i);
  });
  it('shows client-side validation', async () => {
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
