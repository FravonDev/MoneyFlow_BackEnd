import UserRepository from "./UserRepository";
import { NewUser } from "../interfaces/INewUser";

const userRepository = new UserRepository();

let mockUsers: NewUser[] = [];
jest.mock("./UserRepository", () => {
  return jest.fn(() => {
    return {
      createUser: jest.fn().mockImplementation((user: NewUser) => {
        mockUsers.push(user);
        return {
          id: mockUsers.length,
          ...user,
        };
      }),
      getUser: jest
        .fn()
        .mockImplementation((email: string, password: string) => {
          return mockUsers.filter(
            (user) => user.email === email && user.password === password
          );
        }),
      existsUser: jest.fn(
        (email: string) =>
          mockUsers.findIndex((user) => user.email === email) !== -1
      ),
      deleteUser: jest
        .fn()
        .mockImplementation((email: string, password: string) => {
          mockUsers = mockUsers.filter(
            (user) => user.email !== email || user.password !== password
          );
          return mockUsers;
        }),
    };
  });
});

describe("CreateUser", () => {
  it("should create a user", async () => {
    const user: NewUser = {
      name: "Gyro zeppeli",
      email: "zeppeli@example.com",
      balance: 1000,
      password: "somepassword",
    };
    const newUser = await userRepository.createUser(user);
    expect(newUser).toMatchObject({
      name: "Gyro zeppeli",
      email: "zeppeli@example.com",
      balance: 1000,
      password: "somepassword",
    });
    expect(newUser).toHaveProperty("id");
  });
});

describe("getUser", () => {
  it("should get a user by email and password", async () => {
    const email = "zeppeli@example.com";
    const password = "somepassword";
    const user = await userRepository.getUser(email, password);
    expect(user[0]).toHaveProperty("email", "zeppeli@example.com");
    expect(user[0]).toHaveProperty("password", "somepassword");
  });
});

describe("existsUser", () => {
  it("should return the answer if the user exists", async () => {
    const email = "zeppeli@example.com";

    const user = await userRepository.existsUser(email);
    expect(user).toBe(true);
  });
});

describe("deleteUser", () => {
  it("should delete a user by email and password", async () => {
    const email = "zeppeli@example.com";
    const password = "somepassword";
    const user = await userRepository.deleteUser(email, password);
    expect(user).toMatchObject([]);
  });
});
