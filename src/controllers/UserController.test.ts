import request from "supertest";
import app from "../index";

let token = "";

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

describe("POST /login", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/register").send({
      name: "Josefumi Kujo",
      email: "jojo@example.com",
      password: "soft&wet",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Josefumi Kujo");
    expect(response.body).toHaveProperty("email", "jojo@example.com");
  });

  it("should return 200 and a token when email and password are correct", async () => {
    const response = await request(app).post("/login").send({
      email: "jojo@example.com",
      password: "soft&wet",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("userLogin");
    expect(response.body).toHaveProperty("token");
  });

  it("should return 404 when email is incorrect", async () => {
    const response = await request(app).post("/login").send({
      email: "not-found@example.com",
      password: "soft&wet",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 404 when password is incorrect", async () => {
    const response = await request(app).post("/login").send({
      email: "jojo@example.com",
      password: "incorrect-password",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});
describe("POST /logout", () => {
  it("should create a new user", async () => {
    const response = await request(app).post("/register").send({
      name: "Jolyne kujo",
      email: "jolyne@example.com",
      password: "stonefree",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Jolyne kujo");
    expect(response.body).toHaveProperty("email", "jolyne@example.com");
  });

  it("should login new user", async () => {
    const response = await request(app).post("/login").send({
      email: "jolyne@example.com",
      password: "stonefree",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("userLogin");
    expect(response.body).toHaveProperty("token");
    token = response.body.token || response.headers["x-access-token"];
  });

  it("should logout a user", async () => {
    const response = await request(app).post("/logout").send({
      email: "jolyne@example.com",
      password: "stonefree",
      token: token,
    });
    expect(response.statusCode).toBe(204);
  });
  it("should not be able to login", async () => {
    const response = await request(app).post("/logout").send({
      email: "jolyne@example.com",
      password: "stonefree",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "invalid signature");
  });
});
