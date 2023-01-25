import { prisma } from "../database/prisma";
import { NewUser } from "../interfaces/INewUser";

export default class UserRepository {
  async createUser(user: NewUser) {
    if (await this.existsUser(user.email)){
      return new Error("Email already in use");
    }
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        balance: user.balance,
        password: user.password,
      },
    });
  }

  async existsUser(email: string) {
     const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return!!user
  }


  async getUser(email: string, password: string) {
    return await prisma.user.findMany({
      where: {
        email,
        password
      },
    }); 
  }

  async deleteUser(email: string, password: string) {
    return await prisma.user.deleteMany({
      where: {
        email,
        password
      },
    });
  }
  

  
}

