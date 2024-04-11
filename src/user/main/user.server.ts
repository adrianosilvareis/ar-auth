import { diContainer } from "@/containers";
import "./container";

import { Logger } from "@/logger/logger";

import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";

const logger = diContainer.get(Logger);
const registerController = diContainer.get(RegisterController);

export const appUser = (app: Express) => {
  logger.info("start user configurations");

  app.post("/register", async (req: ExpressRequest, res: ExpressResponse) => {
    const response = await registerController.handler(req.body);
    res.status(response.status).json(response.body);
  });
};
