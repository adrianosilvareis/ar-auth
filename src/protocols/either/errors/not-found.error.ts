import { Logger } from "@/logger/logger";

const logger = Logger.getLogger("NotFoundError");
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    logger.error(message ?? "Not found error");
  }
}
