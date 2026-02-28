import jwt from "jsonwebtoken";
import { authMiddleware } from "../../middlewares/auth.middleware";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("middlewares/auth.middleware", () => {
  test("rejects missing token", () => {
    const res = mockRes();
    authMiddleware({ headers: {} } as any, res as any, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("accepts valid token", () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: "1" });
    const res = mockRes();
    const next = jest.fn();
    authMiddleware({ headers: { authorization: "Bearer token" } } as any, res as any, next);
    expect(next).toHaveBeenCalled();
  });
});
