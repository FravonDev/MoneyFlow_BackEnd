import { prisma } from "../database/prisma";
import { Outcome } from "../interfaces/IOutcome";
import { NewOutcome } from "../interfaces/INewOutcome";
import { User } from "../interfaces/IUser";

export default class OutcomeRepository {
  async createOutcome(outcome: NewOutcome, User: User) {
    return await prisma.outcome.create({
      data: {
        description: outcome.description,
        value: outcome.value,
        User: {
          connect: {
            id: User.id,
          },
        },
      },
    });
  }

  async getOutcomes(User: User) {
    return await prisma.outcome.findMany({
      where: {
        userId: User.id,
      },
    });
  }

  async updateOutcome(Outcome: Outcome, NewOutcome:Outcome){
    return await prisma.outcome.update({
      where: {
        id: Outcome.id
      },
      data: {
        description: NewOutcome.description ? NewOutcome.description : Outcome.description,
        value: NewOutcome.value ? NewOutcome.value : Outcome.value
      }

  })}

  async deleteOutcome(Outcome: Outcome) {
    return await prisma.outcome.delete({
      where: { id: Outcome.id },
    });
  }
}

