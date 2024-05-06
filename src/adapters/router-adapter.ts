import { Controller } from "@/protocols/http/controllers";
import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from "express";

export function routerAdapter<T, K>(controller: Controller<T, K>) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    const body = Object.assign({}, req.body, req.query, req.params, {
      headers: req.headers
    });
    const response = await controller.handler(body);
    res.status(response.status).json(response.body);
  };
}
