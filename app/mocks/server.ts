import { type RequestHandler } from "msw";
import { setupServer, type SetupServerApi } from "msw/node";

declare global {
  // eslint-disable-next-line no-var
  var __MSW_SERVER: SetupServerApi | undefined;
}

export const setup = (handlers: RequestHandler[]): SetupServerApi =>
  setupServer(...handlers);

export const start = (server: SetupServerApi) => {
  server.listen({ onUnhandledRequest: "bypass" });
  console.info("🔶 MSW mock server running...");

  process.once("SIGINT", () => {
    globalThis.__MSW_SERVER = undefined;
    server.close();
  });

  process.once("SIGTERM", () => {
    globalThis.__MSW_SERVER = undefined;
    server.close();
  });
};

const restart = (server: SetupServerApi, handlers: RequestHandler[]) => {
  server.close();
  console.info("🔶 Shutting down MSW mock server");

  const _server = setup(handlers);
  globalThis.__MSW_SERVER = _server;

  console.info("🔶 Attempting to restart MSW mock server...");
  start(_server);
};

export const startMockServer = (handlers: RequestHandler[]) => {
  const IS_MSW_SERVER_RUNNING = globalThis.__MSW_SERVER !== undefined;

  if (IS_MSW_SERVER_RUNNING === false) {
    const server = setup(handlers);
    globalThis.__MSW_SERVER = server;
    start(server);
  }
  if (IS_MSW_SERVER_RUNNING) {
    const server = globalThis.__MSW_SERVER;
    if (server) {
      restart(server, handlers);
    }
  }
};
