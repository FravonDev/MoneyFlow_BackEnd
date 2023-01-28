import IncomeRepository from "./IncomeRepository";
import { Income } from "../interfaces/IIncome";
import { User } from "../interfaces/IUser";
import { NewIncome } from "../interfaces/INewIncome";

const incomeRepository = new IncomeRepository();

const testUser = {
  id: 1,
  name: "Jhonny Jestar",
  email: "jhonnyjoestar@example.com",
  balance: 700,
  password: "12345678",
};

let mockRepositories: Income[] = [
  { description: "Aluguel", id: 33, userId: 1, value: 509.56 },
];

jest.mock("./IncomeRepository", () => {
  return jest.fn(() => {
    return {
      createIncome: jest.fn().mockImplementation((income: NewIncome) => {
        const newIncome: Income = {
          id: mockRepositories.length + 1,
          userId: 1,
          value: income.value,
          description: income.description,
        };
        mockRepositories.push(newIncome);
        return newIncome;
      }),
      getIncomes: jest.fn().mockImplementation((user: User) => {
        return mockRepositories.filter((income) => income.userId === user.id);
      }),
      updateIncome: jest
        .fn()
        .mockImplementation((income: Income, newIncome: Income) => {
          mockRepositories = mockRepositories.map((rep) =>
            rep.id == income.id ? { ...rep, ...newIncome } : rep
          );
          return mockRepositories;
        }),
      deleteIncome: jest.fn().mockImplementation((income: Income) => {
        mockRepositories = mockRepositories.slice(income.id, 1);
        return mockRepositories;
      }),
    };
  });
});

describe("IncomeRepository methods", () => {
  it("should create a income", async () => {
    const testincome: NewIncome = {
      description: "Conta de Luz",
      value: 250.56,
    };
    const newIncome = await incomeRepository.createIncome(testincome, testUser);
    expect(newIncome).toMatchObject({
      description: "Conta de Luz",
      value: 250.56,
      id: 2,
    });
    expect(newIncome).toHaveProperty("id");
  });

  it("should get all incomes from a user", async () => {
    const incomes = await incomeRepository.getIncomes(testUser);
    expect(incomes.every((income) => income.userId === testUser.id)).toBe(true);
  });
  it("should delete a Income", async () => {
    const user = await incomeRepository.deleteIncome(mockRepositories[0]);
    expect(mockRepositories.length).toEqual(0);
  });

  it("should update a income", async () => {
    const testincome: Income = {
      id: 33,
      userId: 1,
      value: 100,
      description: "Agua",
    };
    mockRepositories.push({
      description: "Aluguel",
      id: 33,
      userId: 1,
      value: 509.56,
    });
    await incomeRepository.updateIncome(mockRepositories[0], testincome);
    expect(mockRepositories[0]).toEqual({
      id: 33,
      userId: 1,
      value: 100,
      description: "Agua",
    });
  });

 
});
