import { transportConsole } from "@/logger-config";
import { LogLevel } from "@/logger/log-level.enum";
import { Logger } from "@/logger/logger";
import { SensitiveFilter } from "@/logger/sensitive-filter";
import winston from "winston";

describe("Logger", () => {
  let logger: Logger;
  let sensitiveFilter: SensitiveFilter;

  beforeEach(() => {
    Logger.addTransport([transportConsole]);
    Logger.addBlackList(["password", "token"]);
    logger = new Logger("TestLogger");
    sensitiveFilter = new SensitiveFilter(["password", "token"]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a logger instance", () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should log an error message", () => {
    const mockLog = jest.spyOn(Logger.transporter, "log");
    const message = "Error message";
    const metadata = { key: "value" };

    logger.error(message, metadata);

    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "TestLogger",
        level: LogLevel.error,
        message,
        metadata: sensitiveFilter.filterSensitiveKeys(metadata)
      })
    );
  });

  it("should log an info message", () => {
    const mockLog = jest.spyOn(Logger.transporter, "log");
    const message = "Info message";
    const metadata = { key: "value" };

    logger.info(message, metadata);

    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "TestLogger",
        level: LogLevel.info,
        message,
        metadata: sensitiveFilter.filterSensitiveKeys(metadata)
      })
    );
  });

  it("should log a warning message", () => {
    const mockLog = jest.spyOn(Logger.transporter, "log");
    const message = "Warning message";
    const metadata = { key: "value" };

    logger.warn(message, metadata);

    expect(mockLog).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "TestLogger",
        level: LogLevel.warn,
        message,
        metadata: sensitiveFilter.filterSensitiveKeys(metadata)
      })
    );
  });

  it("should add blacklisted properties", () => {
    const blackList = ["password", "creditCard"];
    const sensitiveFilter = new SensitiveFilter(blackList);

    Logger.addBlackList(blackList);

    expect(Logger.blackList).toEqual(blackList);
    expect(Logger.getSensitiveFilter()).toEqual(sensitiveFilter);
  });

  it("should create a logger instance with default name", () => {
    const defaultLogger = Logger.getLogger();

    expect(defaultLogger).toBeInstanceOf(Logger);
    expect(defaultLogger["name"]).toBe("default");
  });

  it("should create a logger instance with custom name", () => {
    const customLogger = Logger.getLogger("CustomLogger");

    expect(customLogger).toBeInstanceOf(Logger);
    expect(customLogger["name"]).toBe("CustomLogger");
  });

  it("should add transports to the logger", () => {
    const transports: winston.transport[] = [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "logs.log" })
    ];

    Logger.addTransport(transports);

    expect(Logger.transporter).toBeDefined();
    expect(Logger.transporter.transports).toEqual(transports);
  });

  it("should pause the logger", () => {
    const mockPause = jest.spyOn(Logger.transporter, "pause");

    Logger.pause();

    expect(mockPause).toHaveBeenCalled();
  });
});
