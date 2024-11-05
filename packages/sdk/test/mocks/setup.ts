import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";
import { afterAll, afterEach, beforeAll } from "vitest";
import { MOCK_API } from "../common/constants.js";

const server = setupServer(...handlers);

// set up
beforeAll(() => {
  if (MOCK_API) {
    server.listen({ onUnhandledRequest: "bypass" });
  }
});

// tear down
afterAll(() => server.close());

// reset
afterEach(() => server.resetHandlers());
