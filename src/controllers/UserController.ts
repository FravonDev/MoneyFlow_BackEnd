import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { validateUser } from "../services/validations/UserValidation";
import {
  ConflictRequestError,
  NotFoundError,
} from "../middlewares/errorHandler/ApiErrors";
import jwt from "jsonwebtoken";
import { loginValidator } from "../services/validations/LoginValidator";

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

  async login(req: Request, res: Response) {
    loginValidator(req)
    const { email, password } = req.body;

    const user = await userRepository.existsUser(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundError("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "1d",
    });
    const { password: _, ...userLogin } = user;
    return res.status(200).json({
      userLogin,
      token,
    });
  }
}
