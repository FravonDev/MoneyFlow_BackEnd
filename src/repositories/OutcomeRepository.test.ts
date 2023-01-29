import OutcomeRepository from "./OutcomeRepository";
import { Outcome } from "../interfaces/IOutcome";
import { User } from "../interfaces/IUser";
import { NewOutcome } from "../interfaces/INewOutcome";

const outcomeRepository = new OutcomeRepository();

const testUser = {
  id: 1,
  name: "Jhonny Jestar",
  email: "jhonnyjoestar@example.com",
  balance: 700,
  password: "12345678",
};

let mockRepositories: Outcome[] = [
  { description: "Aluguel", id: 33, userId: 1, value: 509.56 },
];

jest.mock("./OutcomeRepository", () => {
  return jest.fn(() => {
    return {
      createOutcome: jest.fn().mockImplementation((outcome: NewOutcome) => {
        const NewOutcome: Outcome = {
          id: mockRepositories.length + 1,
          userId: 1,
          value: outcome.value,
          description: outcome.description,
        };
        mockRepositories.push(NewOutcome);
        return NewOutcome;
      }),
      getOutcomes: jest.fn().mockImplementation((user: User) => {
        return mockRepositories.filter((outcome) => outcome.userId === user.id);
      }),
      updateOutcome: jest
        .fn()
        .mockImplementation((outcome: Outcome, newOutcome: Outcome) => {
          mockRepositories = mockRepositories.map((rep) =>
            rep.id == outcome.id ? { ...rep, ...newOutcome } : rep
          );
          return mockRepositories;
        }),
      deleteOutcome: jest.fn().mockImplementation((outcome: Outcome) => {
        mockRepositories = mockRepositories.slice(outcome.id, 1);
        return mockRepositories;
      }),
    };
  });
});

describe("OutcomeRepository methods", () => {
  it("should create a outcome", async () => {
    const testoutcome: NewOutcome = {
      description: "Conta de Luz",
      value: 250.56,
    };
    const newOutcome = await outcomeRepository.createOutcome(testoutcome, testUser);
    expect(newOutcome).toMatchObject({
      description: "Conta de Luz",
      value: 250.56,
      id: 2,
    });
    expect(newOutcome).toHaveProperty("id");
  });

  it("should get all outcomes from a user", async () => {
    const outcomes = await outcomeRepository.getOutcomes(testUser);
    expect(outcomes.every((outcome) => outcome.userId === testUser.id)).toBe(true);
  });
  it("should delete a Outcome", async () => {
    const user = await outcomeRepository.deleteOutcome(mockRepositories[0]);
    expect(mockRepositories.length).toEqual(0);
  });

  it("should update a outcome", async () => {
    const testoutcome: Outcome = {
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
    await outcomeRepository.updateOutcome(mockRepositories[0], testoutcome);
    expect(mockRepositories[0]).toEqual({
      id: 33,
      userId: 1,
      value: 100,
      description: "Agua",
    });
  });

 
});
