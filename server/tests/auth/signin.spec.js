import request from "supertest";
import app from "../../src/app.js";

describe("Get /auth/session", () => {
  test("should return 401 status code", async () => {
    const response = await request(app).get("/auth/session");
    expect(response.status).toBe(401);
  });
});
