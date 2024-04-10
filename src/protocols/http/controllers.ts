import { HttpResponse } from "./http-response";

export interface Controller<T, K> {
  handler(req: T): Promise<HttpResponse<K>>
}