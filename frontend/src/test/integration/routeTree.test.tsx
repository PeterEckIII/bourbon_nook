import { describe, it, expect } from 'vite-plus/test';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';
import { createMockAuthState, createTestQueryClient } from './file-route-utils';

function createTestRouter() {
  return createRouter({
    routeTree,
    context: {
      auth: createMockAuthState(),
      queryClient: createTestQueryClient(),
    },
  });
}

describe('Generated Route Tree', () => {
  it('should generate the route tree from the file structure', () => {
    expect(routeTree).toBeDefined();
    expect(routeTree.children).toBeDefined();
  });

  it('should include all expected routes', () => {
    const router = createTestRouter();
    const routePaths = Object.values(router.routesById).map((route) => route.fullPath);

    expect(routePaths).toContain('/');
    expect(routePaths).toContain('/login');
    expect(routePaths).toContain('/register');
  });

  it('should have correct route hierarchy', () => {
    const router = createTestRouter();
    const homeRoute = router.routesById['/_authenticated/'];

    expect(homeRoute).toBeDefined();
    expect(homeRoute.fullPath).toBe('/');
  });
});
