import { prisma } from "../database/prisma";
import { Income } from "../interfaces/IIncome";
import { NewIncome } from "../interfaces/INewIncome";
import { User } from "../interfaces/IUser";

export default class IncomeRepository {
  async createIncome(Income: NewIncome, id: number) {
    return await prisma.income.create({
      data: {
        description: Income.description,
        value: Income.value,
        User: {
          connect: {
            id,
          },
        },
      },
    });
  }

  async getIncomes(id: number) {
    return await prisma.income.findMany({
      where: {
        userId: id,
      },
    });
  }

  async updateIncome(Income: Income, NewIncome:Income){
    return await prisma.income.update({
      where: {
        id: Income.id
      },
      data: {
        description: NewIncome.description ? NewIncome.description : Income.description,
        value: NewIncome.value ? NewIncome.value : Income.value
      }

  })}

  async deleteIncome(Income: Income) {
    return await prisma.income.delete({
      where: { id: Income.id },
    });
  }
}

