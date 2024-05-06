import "./container";

import { Logger } from "@/logger/logger";

import { Express } from "express";

const logger = Logger.getLogger("Session Configuration");

export const appSession = (app: Express) => {
  logger.info("start session configurations");
};
