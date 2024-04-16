import { diContainer } from "@/containers";
import { Logger } from "@/logger/logger";

const logger = diContainer.get(Logger);
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
    logger.error(message);
  }
}
