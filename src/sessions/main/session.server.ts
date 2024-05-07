import "./container";

import { routerAdapter } from "@/adapters/router-adapter";
import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";
import { RefreshTokenController } from "@/sessions/infrastructure/controllers/refresh-token.controller";
import { Router } from "express";

const refreshTokenController = diContainer.get(RefreshTokenController);

const logger = Logger.getLogger("Session Configuration");

export const appSession = (app: Router) => {
  logger.info("start session configurations");

  app.get("/refresh-token", routerAdapter(refreshTokenController));

  return app;
};
