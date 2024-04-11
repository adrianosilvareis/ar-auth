import { container } from "./container";

import { Logger } from "@/logger/logger";
import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";
import { RegisterController } from "../infrastructure/controllers/register.controller";

const registerController = container.get(RegisterController);
const logger = container.get(Logger);

export const appUser = (app: Express) => {
  logger.info("start user configurations");

  app.post("/register", async (req: ExpressRequest, res: ExpressResponse) => {
    const response = await registerController.handler(req.body);
    res.status(response.status).json(response.body);
  });
};
