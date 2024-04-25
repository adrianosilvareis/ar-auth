import { Logger } from "@/logger/logger";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

const logger = Logger.getLogger("InternalServerError");
export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    logger.error(message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}
