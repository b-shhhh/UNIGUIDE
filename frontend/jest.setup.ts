import "@testing-library/jest-dom";
import { __resetNavigationMocks } from "./__mocks__/next/navigation";
import { TextEncoder, TextDecoder } from "util";

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;
(global as any).fetch = jest.fn();
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = jest.fn();
}

afterEach(() => {
  __resetNavigationMocks();
  jest.clearAllMocks();
});
