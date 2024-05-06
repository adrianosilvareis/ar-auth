import "./container";

import { routerAdapter } from "@/adapters/router-adapter";
import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";

import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { Express } from "express";
import { RefreshTokenController } from "../infrastructure/controllers/refresh-token.controller";

const logger = Logger.getLogger("User Configuration");
const registerController = diContainer.get(RegisterController);
const loginController = diContainer.get(LoginController);
const refreshTokenController = diContainer.get(RefreshTokenController);

export const appUser = (app: Express) => {
  logger.info("start user configurations");

  app.post("/register", routerAdapter(registerController));
  app.post("/login", routerAdapter(loginController));
  app.get("/refresh-token", routerAdapter(refreshTokenController));
};
