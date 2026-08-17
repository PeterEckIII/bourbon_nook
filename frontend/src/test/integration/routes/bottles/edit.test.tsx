import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import { screen, waitFor } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from '../../file-route-utils';
import userEvent from '@testing-library/user-event';
import type { BottleResponseModel } from '../../../../api/generated/bottles-api';
import { customBottlesInstance } from '../../../../api/axios-instance';

function renderEditBottleRouteWithAuth() {
  return renderWithFileRoutes({
    initialLocation: '/bottles/12345/edit',
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

describe('Edit bottle route', () => {
  beforeEach(() => vi.clearAllMocks());
  it('shows the form elements with default values', async () => {
    renderEditBottleRouteWithAuth();
    const selectors = await getSelectors();

    expect(selectors.bottleNameInput).toHaveValue('Test bottle');
    expect(selectors.typeInput).toHaveValue('Bourbon');
    expect(selectors.statusInput).toHaveValue('SEALED');
    expect(selectors.distilleryInput).toHaveValue('Test distillery');
    expect(selectors.producerInput).toHaveValue('Test producer');
    expect(selectors.countryInput).toHaveValue('Test country');
    expect(selectors.regionInput).toHaveValue('Test region');
    expect(selectors.priceInput).toHaveValue(25.99);
    expect(selectors.ageInput).toHaveValue('NAS');
    expect(selectors.proofInput).toHaveValue(100);
    expect(selectors.yearInput).toHaveValue(2025);
    expect(selectors.barrelInput).toHaveValue('N/A');
    expect(selectors.finishingInput).toHaveValue('N/A');
  });
  it('allows editing fields and submitting the form', async () => {
    const { router } = renderEditBottleRouteWithAuth();
    const selectors = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomBottlesInstance = vi.mocked(customBottlesInstance);

    await user.clear(selectors.bottleNameInput);
    await user.type(selectors.bottleNameInput, 'New bottle');

    await user.clear(selectors.typeInput);
    await user.type(selectors.typeInput, 'Rye');

    await user.selectOptions(selectors.statusInput, 'OPENED');

    await user.clear(selectors.priceInput);
    await user.type(selectors.priceInput, '100.00');

    await waitFor(() => expect(selectors.submitButton).not.toBeDisabled(), {
      timeout: 2000,
    });
    await user.click(selectors.submitButton);

    expect(mockedCustomBottlesInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: '/bottles/12345',
        data: {
          ...returnBottleResponse(),
          name: 'New bottle',
          type: 'Rye',
          status: 'OPENED',
          price: 100.0,
        },
      }),
    );

    expect(router.state.location.pathname).toBe('/bottles/12345');
    expect(await screen.findByText(/add photo/i)).toBeInTheDocument();
  });
  it('shows the backend error message on a failed edit', async () => {
    renderEditBottleRouteWithAuth();
    const { submitButton } = await getSelectors();
    const user = userEvent.setup();
    const mockedCustomBottlesInstance = vi.mocked(customBottlesInstance);

    mockedCustomBottlesInstance.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Could not save your edits' } },
    });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not save your edits/i);
  });
  it('shows client-side validation', async () => {
    renderEditBottleRouteWithAuth();
    const user = userEvent.setup();
    const selectors = await getSelectors();

    await user.clear(selectors.bottleNameInput);
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required');

    await user.type(selectors.bottleNameInput, 'George Remus');
    await user.tab();
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
