import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

const logger = diContainer.get(Logger);
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = getReasonPhrase(StatusCodes.UNAUTHORIZED);
    logger.error(message);
  }
}
