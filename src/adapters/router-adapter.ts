import { Controller } from "@/protocols/http/controllers";
import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";

export function routerAdapter<T, K>(controller: Controller<T, K>) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    const response = await controller.handler(req.body);
    res.status(response.status).json(response.body);
  };
}
