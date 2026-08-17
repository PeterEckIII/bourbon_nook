import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor, within } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import type { BottleResponseModel } from '../../../../api/generated/bottles-api';
import { customBottlesInstance } from '../../../../api/axios-instance';

function renderNewBottleRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/bottles/new',
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
  const bottleNameInput = await screen.findByRole('textbox', {
    name: /bottle name/i,
  });
  const typeInput = await screen.findByRole('textbox', { name: /type/i });
  const statusInput = await screen.findByLabelText(/bottle status/i);
  const distilleryInput = await screen.findByRole('textbox', {
    name: /distillery/i,
  });
  const producerInput = await screen.findByRole('textbox', {
    name: /producer/i,
  });
  const countryInput = await screen.findByRole('textbox', {
    name: /country of origin/i,
  });
  const regionInput = await screen.findByRole('textbox', { name: /region/i });
  const priceInput = await screen.findByRole('spinbutton', {
    name: /price/i,
  });
  const ageInput = await screen.findByRole('textbox', { name: /^age/i });
  const proofInput = await screen.findByRole('spinbutton', {
    name: /proof/i,
  });
  const yearInput = await screen.findByRole('spinbutton', {
    name: /release year/i,
  });
  const barrelInput = await screen.findByRole('textbox', {
    name: /barrel information/i,
  });
  const finishingInput = await screen.findByRole('textbox', {
    name: /finishing barrels/i,
  });
  const openDateInput = await screen.findByLabelText(/open date/i);
  const killDateInput = await screen.findByLabelText(/kill date/i);

  const submitButton = await screen.findByRole('button', {
    name: /save bottle/i,
  });

  return {
    bottleNameInput,
    typeInput,
    statusInput,
    distilleryInput,
    producerInput,
    countryInput,
    regionInput,
    priceInput,
    ageInput,
    proofInput,
    yearInput,
    barrelInput,
    finishingInput,
    openDateInput,
    killDateInput,
    submitButton,
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

vi.mock('../../../../api/axios-instance', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../api/axios-instance')>();
  const bottleResponse = returnBottleResponse();

  return {
    ...actual,
    customBottlesInstance: vi.fn().mockResolvedValue({ id: '12345', ...bottleResponse }),
  };
});

describe('New bottle route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('shows the form elements', async () => {
    renderNewBottleRouteWithAuth();
    const selectors = await getSelectors();

    expect(selectors.bottleNameInput).toBeInTheDocument();
    expect(selectors.typeInput).toBeInTheDocument();
    expect(selectors.statusInput).toBeInTheDocument();
    expect(selectors.distilleryInput).toBeInTheDocument();
    expect(selectors.producerInput).toBeInTheDocument();
    expect(selectors.countryInput).toBeInTheDocument();
    expect(selectors.regionInput).toBeInTheDocument();
    expect(selectors.priceInput).toBeInTheDocument();
    expect(selectors.ageInput).toBeInTheDocument();
    expect(selectors.proofInput).toBeInTheDocument();
    expect(selectors.yearInput).toBeInTheDocument();
    expect(selectors.barrelInput).toBeInTheDocument();
    expect(selectors.finishingInput).toBeInTheDocument();
    expect(selectors.openDateInput).toBeInTheDocument();
    expect(selectors.killDateInput).toBeInTheDocument();
    expect(selectors.submitButton).toBeInTheDocument();
  });
  it('allows submitting the form', async () => {
    renderNewBottleRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomBottlesInstance = vi.mocked(customBottlesInstance);

    await user.type(selectors.bottleNameInput, 'Test bottle');
    await user.type(selectors.typeInput, 'Bourbon');
    await user.type(selectors.distilleryInput, 'Test distillery');
    await user.type(selectors.producerInput, 'Test producer');
    await user.type(selectors.countryInput, 'Test country');
    await user.type(selectors.regionInput, 'Test region');
    await user.type(selectors.priceInput, '25.99');
    await user.type(selectors.ageInput, 'NAS');
    await user.type(selectors.proofInput, '100');
    await user.type(selectors.yearInput, '2025');
    await user.type(selectors.barrelInput, 'N/A');
    await user.type(selectors.finishingInput, 'N/A');
    await waitFor(() => expect(selectors.submitButton).not.toBeDisabled(), {
      timeout: 2000,
    });
    await user.click(selectors.submitButton);

    expect(mockedCustomBottlesInstance).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: 'POST',
        url: '/bottles/new',
        data: { ...returnBottleResponse() },
      }),
    );

    expect(mockedCustomBottlesInstance).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ method: 'GET', url: '/bottles/12345' }),
    );

    expect(await screen.findByText(/test bottle/i)).toBeInTheDocument();
    expect(await screen.findByText(/add photo/i)).toBeInTheDocument();
  });
  it('redirects unauthenticated users to /login', async () => {
    renderWithFileRoutes({
      initialLocation: '/bottles/new',
      routerContext: {
        auth: createMockAuthState({
          user: null,
          isAuthenticated: false,
        }),
      },
    });

    expect(await screen.findByText(/log in to bourbonnook/i)).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });
  it('shows the backend error message on a failed create', async () => {
    renderNewBottleRouteWithAuth();
    const { bottleNameInput, typeInput, submitButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomBottlesInstance = vi.mocked(customBottlesInstance);

    mockedCustomBottlesInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not save bottle: connection lost' } },
    });

    await user.type(bottleNameInput, 'Test');
    await user.type(typeInput, 'Bourbon');
    await user.tab();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);

    expect(await screen.getByRole('alert')).toHaveTextContent(
      /could not save bottle: connection lost/i,
    );
  });
  it('shows client side validation', async () => {
    renderNewBottleRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();

    await user.click(selectors.submitButton);

    expect(within(selectors.bottleNameInput.closest('div')!).getByRole('alert')).toHaveTextContent(
      /name is required/i,
    );

    expect(within(selectors.typeInput.closest('div')!).getByRole('alert')).toHaveTextContent(
      /type is required/i,
    );
  });
});
