import { Either } from "../either/either";
import { HttpResponse } from "./http-response";

export interface Controller<T, K> {
  handler(req: Either<unknown, T> | T): Promise<HttpResponse<K>>;
}
