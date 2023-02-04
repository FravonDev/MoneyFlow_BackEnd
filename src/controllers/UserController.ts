import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { validateUser } from "../services/validations/UserValidation";

const userRepository = new UserRepository();

export class UserController {
  async register(req: Request, res: Response) {
    const dataErrors = validateUser(req);
    if (dataErrors) {
      console.log(dataErrors);
      return res.status(400).json(dataErrors);
    }

    const { name, email, password } = req.body;
    try {
      const userExists = await userRepository.existsUser(email);
      if (userExists) {
        return res.status(409).json({ error: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        balance: 0,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
