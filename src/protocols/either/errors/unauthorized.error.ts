import { Logger } from "@/logger/logger";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

const logger = Logger.getLogger("UnauthorizedError");

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = getReasonPhrase(StatusCodes.UNAUTHORIZED);
    logger.error(message || getReasonPhrase(StatusCodes.UNAUTHORIZED));
  }
}
