import "./container";

import { routerAdapter } from "@/adapters/router-adapter";
import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";

import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { Express } from "express";

const logger = Logger.getLogger("User Configuration");
const registerController = diContainer.get(RegisterController);
const loginController = diContainer.get(LoginController);

export const appUser = (app: Express) => {
  logger.info("start user configurations");

  app.post("/register", routerAdapter(registerController));
  app.post("/login", routerAdapter(loginController));
};
