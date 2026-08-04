import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { createMockAuthState, renderWithFileRoutes } from './file-route-utils';

describe('File Route Conventions', () => {
  it('should render the index route at the root path', async () => {
    renderWithFileRoutes({
      initialLocation: '/',
      routerContext: {
        auth: createMockAuthState({
          isAuthenticated: true,
          user: null,
        }),
      },
    });

    expect(await screen.findByText('Hello "/"!')).toBeInTheDocument();
  });
});
