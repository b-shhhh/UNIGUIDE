import request from "supertest";

jest.mock("../../database/mongodb", () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("mongoose", () => ({
  connection: { readyState: 1 },
}));

jest.mock("../../middlewares/upload.middleware", () => ({
  upload: {
    fields: () => (_req: any, _res: any, next: any) => next(),
  },
}));

jest.mock("../../middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "Bearer deny") {
      return res.status(401).json({ success: false });
    }
    req.user = { id: "user-1" };
    next();
  },
}));

jest.mock("../../controllers/auth.controller", () => ({
  register: (_req: any, res: any) => res.status(201).json({ success: true, action: "register" }),
  login: (_req: any, res: any) => res.status(200).json({ success: true, token: "token" }),
  whoAmI: (_req: any, res: any) => res.status(200).json({ success: true, user: { id: "user-1" } }),
  updateProfile: (_req: any, res: any) => res.status(200).json({ success: true, updated: true }),
  changePassword: (_req: any, res: any) => res.status(200).json({ success: true, changed: true }),
  requestPasswordReset: (_req: any, res: any) => res.status(200).json({ success: true, reset: true }),
  resetPassword: (_req: any, res: any) => res.status(200).json({ success: true }),
}));

jest.mock("../../controllers/user.controller", () => ({
  removeAccount: (_req: any, res: any) => res.status(200).json({ success: true, removed: true }),
}));

import app from "../../app";

describe("auth integration", () => {
  test("register returns 201", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "a@b.com" });
    expect(res.status).toBe(201);
    expect(res.body.action).toBe("register");
  });

  test("login returns token", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com", password: "pw" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe("token");
  });

  test("whoAmI requires auth", async () => {
    const res = await request(app).get("/api/auth/whoami").set("Authorization", "Bearer allow");
    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe("user-1");
  });

  test("update profile succeeds", async () => {
    const res = await request(app)
      .put("/api/auth/update-profile")
      .set("Authorization", "Bearer allow")
      .send({ fullName: "New Name" });
    expect(res.status).toBe(200);
  });

  test("change password succeeds", async () => {
    const res = await request(app)
      .put("/api/auth/change-password")
      .set("Authorization", "Bearer allow")
      .send({ oldPassword: "old", newPassword: "new" });
    expect(res.status).toBe(200);
  });

  test("delete account uses auth middleware", async () => {
    const res = await request(app)
      .delete("/api/auth/delete-account")
      .set("Authorization", "Bearer allow");
    expect(res.status).toBe(200);
  });
});
