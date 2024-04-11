import { injectable } from "inversify";
import winston from "winston";

const filesError = new winston.transports.File({
  filename: "error.log",
  level: "warn"
});
const filesApp = new winston.transports.File({ filename: "app.log" });
const console = new winston.transports.Console({
  format: winston.format.simple()
});

@injectable()
export class Logger {
  private _logger: winston.Logger;

  constructor() {
    this._logger = this.configureLogger();
    this.addDevConfig();
  }

  private addDevConfig(): void {
    if (process.env.NODE_ENV !== "production") {
      this._logger.remove(filesError);
      this._logger.remove(filesApp);
      this._logger.add(console);

      this._logger.silent = process.env.NODE_ENV === "test";
    }
  }

  private configureLogger() {
    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [filesError, filesApp]
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
