import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
import { inject, injectable } from 'inversify';

@injectable()
export class RegisterController implements Controller<UserNewProps, UserMissInfo> {

  constructor(@inject(UserRepository) private readonly repository: UserRepository) {}

  handler(req: UserNewProps): HttpResponse<UserMissInfo> {
    const user = this.repository.register(req);
    return Response.Ok(user);
  }
}
