import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { afterAll, afterEach, beforeAll } from "vitest";
import { MOCK_API } from "../common/constants";

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
