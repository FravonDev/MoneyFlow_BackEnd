import request from "supertest";
import app from "../index";

describe("POST /register", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/register").send({
      name: "Johnny Joestar",
      email: "johnny@example.com",
      password: "johnnyBgoode",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Johnny Joestar");
    expect(response.body).toHaveProperty("email", "johnny@example.com");
  });

  it("should return 409 when email is already in use", async () => {
    await request(app).post("/register").send({
      name: "super test",
      email: "super@super.com",
      password: "password123",
    });

    const response = await request(app).post("/register").send({
      name: "mario",
      email: "super@super.com",
      password: "password123",
    });
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 400 when request body is invalid", async () => {
    const response = await request(app).post("/register").send({
      name: "",
      email: "invalidemail",
      password: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
