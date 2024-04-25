import winston from "winston";
import { Logger } from "./logger/logger";

export const transportFilesError = new winston.transports.File({
  filename: "error.log",
  level: "warn"
});
export const transportFilesApp = new winston.transports.File({
  filename: "app.log"
});
export const transportConsole = new winston.transports.Console({
  format: winston.format.simple()
});

const transports =
  process.env.NODE_ENV !== "production"
    ? [transportConsole]
    : [transportFilesError, transportFilesApp, transportConsole];

Logger.addTransport(transports);
Logger.addBlackList(["password", "token"]);
