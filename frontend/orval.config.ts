import { defineConfig } from "orval";

export default defineConfig({
  bottlesApi: {
    input: "http://localhost:8083/v3/api-docs",
    output: {
      mode: "single",
      target: "src/api/generated/bottles-api.ts",
      client: "axios",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
  usersApi: {
    input: "http://localhost:8081/v3/api-docs",
    output: {
      mode: "single",
      target: "src/api/generated/users-api.ts",
      client: "axios",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
  reviewsApi: {
    input: "http://localhost:8084/v3/api-docs",
    output: {
      mode: "single",
      target: "src/api/generated/reviews-api.ts",
      client: "axios",
      override: {
        mutator: {
          path: "./src/api/axios-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
