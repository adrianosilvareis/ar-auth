import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export interface HttpResponse<K> {
  status: number;
  statusText: string;
  body: K
}

export class Response {
  static Ok<K>(body: K): HttpResponse<K> {
    return {
      status: StatusCodes.OK,
      statusText: getReasonPhrase(StatusCodes.OK),
      body
    }
  }

  static BadRequest<K>(body: K): HttpResponse<K> {
    return {
      status: StatusCodes.BAD_REQUEST,
      statusText: getReasonPhrase(StatusCodes.BAD_REQUEST),
      body
    }
  }
}

