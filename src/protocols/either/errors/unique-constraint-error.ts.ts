import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class UniqueConstraintError extends Error {
  constructor(constraint?: string) {
    super(`Unique constraint failed on the ${constraint}`);
    this.name = getReasonPhrase(StatusCodes.BAD_REQUEST);
  }
}
