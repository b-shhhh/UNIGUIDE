// Jest setup for backend tests
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_value_change_me";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

afterAll(() => {
  jest.useRealTimers();
});
