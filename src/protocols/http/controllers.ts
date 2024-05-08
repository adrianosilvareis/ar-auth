import { IncomingHttpHeaders } from "http";
import { Either } from "../either/either";
import { HttpResponse } from "./http-response";

export interface IHeaders {
  headers?: IncomingHttpHeaders;
}
export interface Controller<T, K> {
  handler(
    req: Either<unknown, T & IHeaders> | (T & IHeaders)
  ): Promise<HttpResponse<K>>;
}
