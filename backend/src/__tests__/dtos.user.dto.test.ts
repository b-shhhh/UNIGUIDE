import { loginSchema, registerSchema } from "../dtos/user.dto";

describe("dtos/user.dto", () => {
  test("registerSchema passes with valid data", () => {
    const parsed = registerSchema.parse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      countryCode: "+1",
      phone: "5551234567",
      password: "secret12",
      confirmPassword: "secret12"
    });
    expect(parsed.email).toBe("jane@example.com");
  });

  test("registerSchema fails when fullName missing", () => {
    expect(() =>
      registerSchema.parse({
        email: "x@example.com",
        phone: "1234567",
        password: "abcdef",
        confirmPassword: "abcdef"
      })
    ).toThrow(/fullName/i);
  });

  test("registerSchema fails when passwords mismatch", () => {
    expect(() =>
      registerSchema.parse({
        fullName: "Mismatch",
        email: "x@example.com",
        phone: "1234567",
        password: "abcdef",
        confirmPassword: "abcdeg"
      })
    ).toThrow(/passwords do not match/i);
  });

  test("loginSchema accepts optional role", () => {
    const parsed = loginSchema.parse({
      email: "user@example.com",
      password: "abcdef",
      role: "admin"
    });
    expect(parsed.role).toBe("admin");
  });

  test("loginSchema rejects invalid email", () => {
    expect(() =>
      loginSchema.parse({
        email: "not-an-email",
        password: "abcdef"
      })
    ).toThrow(/invalid email/i);
  });

  test("loginSchema rejects short password", () => {
    expect(() =>
      loginSchema.parse({
        email: "user@example.com",
        password: "123"
      })
    ).toThrow(/at least 6/i);
  });
});
