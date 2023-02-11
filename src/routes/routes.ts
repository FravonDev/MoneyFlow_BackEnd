import "express-async-errors";
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { auth } from "../middlewares/auth/authenticate";

const routes = Router();

routes.post("/register", new UserController().register);
routes.post("/login", new UserController().login);
routes.post("/logout", auth, new UserController().logout);

export { routes };
