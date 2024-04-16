import "./container";

import { diContainer } from "@/containers";

import { Logger } from "@/logger/logger";

import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";

const logger = diContainer.get(Logger);
const registerController = diContainer.get(RegisterController);
const loginController = diContainer.get(LoginController);

export const appUser = (app: Express) => {
  logger.info("start user configurations");

  app.post("/register", async (req: ExpressRequest, res: ExpressResponse) => {
    const response = await registerController.handler(req.body);
    res.status(response.status).json(response.body);
  });

  app.post("/login", async (req: ExpressRequest, res: ExpressResponse) => {
    const response = await loginController.handler(req.body);
    res.status(response.status).json(response.body);
  });
};
