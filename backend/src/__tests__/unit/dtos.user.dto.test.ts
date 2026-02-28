import { loginSchema, registerSchema } from "../../dtos/user.dto";

describe("dtos/user.dto", () => {
  test("registerSchema requires fullName", () => {
    expect(() =>
      registerSchema.parse({ email: "a@b.com", phone: "1234567", password: "secret" })
    ).toThrow();
  });

  test("loginSchema validates email", () => {
    expect(() => loginSchema.parse({ email: "bad", password: "secret" })).toThrow();
  });
});
