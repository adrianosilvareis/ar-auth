import { injectable } from "inversify";
import winston from "winston";

@injectable()
export class Logger {
  private _logger: winston.Logger;

  constructor() {
    this._logger = this.configureLogger();
    this.addDevConfig();
  }

  private addDevConfig(): void {
    if (process.env.NODE_ENV !== "production") {
      this._logger.add(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    }
  }

  private configureLogger() {
    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: "error.log", level: "warn" }),
        new winston.transports.File({ filename: "app.log" })
      ]
    });
  }

  error(message: unknown) {
    this._logger.error(message);
  }

  warn(message: unknown) {
    this._logger.warn(message);
  }

  info(message: unknown) {
    this._logger.info(message);
  }
}
