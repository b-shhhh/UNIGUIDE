// Jest global setup for backend unit tests
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_value_change_me";

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

afterAll(() => {
  jest.useRealTimers();
});
