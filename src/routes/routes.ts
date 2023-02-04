import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateUser } from "../services/validations/UserValidation";

const routes = Router();

routes.post("/register", new UserController().register);

export { routes };
