import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithFileRoutes } from '../file-route-utils';

describe('Login route', () => {
  it('should test the login route component', async () => {
    renderWithFileRoutes({
      initialLocation: '/login',
    });
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });
});
