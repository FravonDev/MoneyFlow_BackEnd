import { prisma } from "../database/prisma";
import { NewUser } from "../interfaces/INewUser";
import { User } from "../interfaces/IUser";

export default class UserRepository {
  async createUser(NewUserData: NewUser) {
    return await prisma.user.create({
      data: {
        name: NewUserData.name,
        email: NewUserData.email,
        balance: NewUserData.balance,
        password: NewUserData.password,
      },
    });
  }

  async existsUser(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return !!user;
  }

  async getUser(email: string, password: string) {
    return await prisma.user.findMany({
      where: {
        email,
        password,
      },
    });
  }

  async deleteUser(email: string, password: string) {
    return await prisma.user.deleteMany({
      where: {
        email,
        password,
      },
    });
  }

  async updateUser(User: User, NewUserData: NewUser) {
    return await prisma.user.update({
      where: {
        id: User.id,
      },
      data: {
        name: NewUserData.name ? NewUserData.name : User.name,
        email: NewUserData.email ? NewUserData.email : User.email,
        password: NewUserData.password ? NewUserData.password : User.password,
      },
    });
  }

  async updateBalance(userId: number, value: number, isIncome: boolean) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    const newBalance = isIncome ? user.balance + value : user.balance - value;
    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }
}