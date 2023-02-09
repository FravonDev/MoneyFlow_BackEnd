import UserRepository from "./UserRepository";
import { NewUser } from "../interfaces/INewUser";
import { User } from "../interfaces/IUser";
import { Income } from "../interfaces/IIncome";
import { NewIncome } from "../interfaces/INewIncome";

const userRepository = new UserRepository();

let mockUsers: User[] = [
  {
    id: 1,
    name: "Giorno Giovanna",
    email: "giorno@example.com",
    password: "newpassword",
    balance: 650,
  },
  {
    id: 2,
    name: "Ichigo kurosaki",
    email: "ichigo@example.com",
    password: "zangetsu",
    balance: 1000,
  },
];

const changedUser: NewUser = {
  name: "Maito Gai",
  email: "maitogai@example.com",
  password: "determinacao",
  balance: 100,
};

jest.mock("./UserRepository", () => {
  return jest.fn(() => {
    return {
      createUser: jest.fn().mockImplementation((user: NewUser) => {
        const NewUser = {
          id: mockUsers.length,
          ...user,
        };
        mockUsers.push(NewUser);
        return mockUsers[NewUser.id];
      }),
      getUser: jest
        .fn()
        .mockImplementation((email: string, password: string) => {
          return mockUsers.filter(
            (user) => user.email === email && user.password === password
          )[0];
        }),
      existsUser: jest.fn(
        (email: string) =>
          mockUsers.filter((user) => user.email === email)
      ),
      updateUser: jest
        .fn()
        .mockImplementation((income: Income, newIncome: NewIncome) => {
          const index = mockUsers.findIndex((user) => user.id === income.id);
          mockUsers[index] = { ...mockUsers[index], ...newIncome };
          return mockUsers[index];
        }),
      updateBalance: jest
        .fn()
        .mockImplementation(
          async (userId: number, value: number, isIncome: boolean) => {
            let user = await mockUsers[userId - 1];
            let newBalance = user.balance;
            if (isIncome) {
              newBalance += value;
            } else {
              newBalance -= value;
            }
            mockUsers[userId - 1].balance = newBalance;
            return mockUsers;
          }
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

describe("UserRepository/", () => {
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

  it("should get a user by email and password", async () => {
    const email = "ichigo@example.com";
    const password = "zangetsu";
    const user = await userRepository.getUser(email, password);
    expect(user).toHaveProperty("email", "ichigo@example.com");
    expect(user).toHaveProperty("password", "zangetsu");
  });

  it("should return the answer if the user exists", async () => {
    const email = "giorno@example.com";

    const user = await userRepository.existsUser(email);
    expect(user).toMatchObject([mockUsers[0]]);
  });

  it("should delete a user by email and password", async () => {
    const email = "ichigo@example.com";
    const password = "zangetsu";
    await userRepository.deleteUser(email, password);
    expect(userRepository.existsUser(email)).toStrictEqual([]);
  });

  it("should update a user", async () => {
    const user = await userRepository.updateUser(mockUsers[0], changedUser);
    expect(user).toMatchObject({
      id: 1,
      name: "Maito Gai",
      email: "maitogai@example.com",
      password: "determinacao",
    });
  });

  it("should update user's balance when income is created", async () => {
    const fakeIncome = { value: 135, description: "Fake Income" };
    await userRepository.updateBalance(mockUsers[1].id, fakeIncome.value, true);
    expect(mockUsers[1].balance).toEqual(1135);
  });

  it("should update the balance of the user when creating a outcome", async () => {
    const fakeOutcome = { value: 300, description: "Fake Income" };
    await userRepository.updateBalance(mockUsers[1].id, fakeOutcome.value, false);
    expect(mockUsers[1].balance).toEqual(835);
  });
});
