import { StatusCodes, getReasonPhrase } from "http-status-codes";

export interface HttpResponse<K> {
  status: number;
  statusText: string;
  body: K;
}

export class Response {
  static Ok<K>(body: K): HttpResponse<K> {
    return {
      status: StatusCodes.OK,
      statusText: getReasonPhrase(StatusCodes.OK),
      body
    };
  }

  static BadRequest(body: any): HttpResponse<any> {
    return {
      status: StatusCodes.BAD_REQUEST,
      statusText: getReasonPhrase(StatusCodes.BAD_REQUEST),
      body
    };
  }

  static Unauthorized(body: any): HttpResponse<any> {
    return {
      status: StatusCodes.UNAUTHORIZED,
      statusText: getReasonPhrase(StatusCodes.UNAUTHORIZED),
      body
    };
  }

  static InternalServerError(body: any): HttpResponse<any> {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      body
    };
  }
}
