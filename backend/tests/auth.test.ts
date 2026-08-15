import request from "supertest";
import { createApp } from "../src/app";
import { db } from "../src/db";
import bcrypt from "bcryptjs";

describe("Auth Endpoints", () => {
  const app = createApp();
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    phone: "9876543210",
    role: "user"
  };

  beforeAll(async () => {
    // Clear test user if exists
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await db.getPool().end();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail if email already exists", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toMatch(/registered/i);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword"
        });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
