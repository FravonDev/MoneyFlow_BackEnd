import app from "..";
import request from "supertest";
let token = "";

describe("POST /income", () => {
  it("should create a user for incomes test", async () => {
    const response = await request(app).post("/register").send({
      name: "Ringo Roadagain",
      email: "ringo@example.com",
      password: "mandom1234",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Ringo Roadagain");
    expect(response.body).toHaveProperty("email", "ringo@example.com");
  });

  it("should login a user for incomes test", async () => {
    const response = await request(app).post("/login").send({
      email: "ringo@example.com",
      password: "mandom1234",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("userLogin");
    expect(response.body).toHaveProperty("token");
    token = response.body.token || response.headers["x-access-token"];
  });

  it("should create a new income and return 201", async () => {
    const response = await request(app)
      .post("/income")
      .set("x-access-token", token)
      .send({
        description: "test description",
        value: 300,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("description", "test description");
    expect(response.body).toHaveProperty("value", 300);
  });

  it("should not create a income, return 401", async () => {
    const response = await request(app)
      .post("/income")
      .set("x-access-token", "UHsdosfjdfdsf.sadadfdsfd.cxsadsasdfgds.sadsd")
      .send({
        description: "nooo",
        value: 100,
      });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("message", "jwt malformed");
  });
});
//TODO
describe("/DELETE income", () => {
  it("should delete an income", async () => {
    const response = await request(app)
      .delete("/income")
      .send({
        incomeId: 1
      })
      .set("x-access-token", token);
      expect(response.statusCode).toBe(204)
  });

  it("should not delete a income, should return 404", async () => {
    const response = await request(app)
      .delete("/income")
      .send({
        incomeId: 3
      })
      .set("x-access-token", token);
      expect(response.statusCode).toBe(404)
  });
});
