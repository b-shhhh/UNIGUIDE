import request from "supertest";

jest.mock("../../database/mongodb", () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("mongoose", () => ({
  connection: { readyState: 1 },
}));

import app from "../../app";

describe("database / health integration", () => {
  test("health endpoint returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("ready endpoint returns ready when connection ready", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ready");
  });

  test("unknown route returns 404", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
  });

  test("CORS headers are set", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});
