import { StatusCodes, getReasonPhrase } from "http-status-codes";

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    console.error(message)
  }
}