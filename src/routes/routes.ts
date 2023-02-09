import "express-async-errors";
import { Router } from "express";
import { UserController } from "../controllers/UserController";

const routes = Router();

routes.post("/register", new UserController().register);
routes.post("/login", new UserController().login);

export { routes };
