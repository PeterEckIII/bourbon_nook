import { defineConfig } from 'orval';

export default defineConfig({
  bottlesApi: {
    input: 'http://localhost:8083/v3/api-docs',
    output: {
      mode: 'single',
      target: 'src/api/generated/bottles-api.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
  },
  usersApi: {
    input: 'http://localhost:8081/v3/api-docs',
    output: {
      mode: 'single',
      target: 'src/api/generated/users-api.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
  },
  reviewsApi: {
    input: 'http://localhost:8084/v3/api-docs',
    output: {
      mode: 'single',
      target: 'src/api/generated/reviews-api.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
  },
});
