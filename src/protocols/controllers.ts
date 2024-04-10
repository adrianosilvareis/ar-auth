import { Request } from "./http-request";
import { HttpResponse, Response } from "./http-response";

export interface Controller<T, K> {
  handler(req: Request<T>, res: Response<K>): HttpResponse<K>
}