import { describe, it, expect } from 'vite-plus/test';
import { screen, within } from '@testing-library/react';
import { renderWithFileRoutes } from '../file-route-utils';

describe('About route', () => {
  it('renders the page and all components', async () => {
    renderWithFileRoutes({
      initialLocation: '/about',
    });

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      /about bourbon nook/i,
    );
    expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent(/what you can do/i);

    const featureList = await screen.findByRole('list', { name: /features/i });
    const featureItems = await within(featureList).findAllByRole('listitem');
    expect(featureItems).toHaveLength(3);
  });
});
