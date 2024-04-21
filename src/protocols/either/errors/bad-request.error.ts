import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

const logger = diContainer.get(Logger);
export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = getReasonPhrase(StatusCodes.BAD_REQUEST);
    logger.error(message);
  }
}
