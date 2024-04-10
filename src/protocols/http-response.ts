export interface HttpResponse<K> {
  status: number;
  statusName: string;
  body: K
}

export interface Response<K> {
  Ok(body: K): HttpResponse<K>,
  BadRequest(body: K): HttpResponse<K>
}
