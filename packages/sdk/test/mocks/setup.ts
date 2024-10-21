import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { afterAll, afterEach, beforeAll } from "vitest";

const server = setupServer(...handlers);

// set up
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// tear down
afterAll(() => server.close());

// reset
afterEach(() => server.resetHandlers());
