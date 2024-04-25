import winston from "winston";
import { LogLevel } from "./log-level.enum";
import { SensitiveFilter } from "./sensitive-filter";

export class Logger {
  public static blackList: string[] = [];
  public static transporter: winston.Logger;

  private name: string;
  private static sensitive: SensitiveFilter;

  constructor(name: string) {
    this.name = name;
  }

  static addBlackList(blackList: string[]) {
    Logger.blackList = blackList;
    Logger.sensitive = new SensitiveFilter(blackList);
  }

  static getLogger(className: string | Function = "default"): Logger {
    return new Logger(
      typeof className === "string" ? className : className.name
    );
  }

  static addTransport(transports: winston.transport[]) {
    Logger.transporter = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports
    });
  }

  static pause() {
    Logger.transporter.pause();
  }

  static getSensitiveFilter(): SensitiveFilter {
    return Logger.sensitive;
  }

  error(message: string, metadata: Record<string, any> = {}) {
    this.log(LogLevel.error, message, metadata);
  }

  info(message: string, metadata: Record<string, any> = {}) {
    this.log(LogLevel.info, message, metadata);
  }

  warn(message: string, metadata: Record<string, any> = {}) {
    this.log(LogLevel.warn, message, metadata);
  }

  log(
    level: LogLevel,
    message: string,
    metadata: Record<string, any> = {}
  ): void {
    Logger.transporter.log({
      name: this.name,
      level,
      message,
      metadata: Logger.sensitive.filterSensitiveKeys(metadata)
    });
  }
}
