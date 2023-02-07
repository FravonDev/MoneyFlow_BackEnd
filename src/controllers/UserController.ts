import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { validateUser } from "../services/validations/UserValidation";
import { ConflictRequestError } from "../middlewares/errorHandler/ApiErrors";

const userRepository = new UserRepository();

export class UserController {
  async register(req: Request, res: Response) {
    validateUser(req);

    const { name, email, password } = req.body;
    const userExists = await userRepository.existsUser(email);

    if (userExists) {
      throw new ConflictRequestError("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      balance: 0,
    });
    
    if (newUser instanceof Error) throw new Error();
    const { password: _, ...user } = newUser;
    return res.status(201).json(user);
  }
}