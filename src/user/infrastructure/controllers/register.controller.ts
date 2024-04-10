import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
import { inject, injectable } from 'inversify';

@injectable()
export class RegisterController implements Controller<UserNewProps, UserMissInfo> {

  constructor(@inject(UserRepository) private readonly repository: UserRepository) {}

  async handler(req: UserNewProps): Promise<HttpResponse<UserMissInfo>> {
    const user = await this.repository.register(req);
    if (user.isRight()) {
      return Response.Ok(user.value);
    }
    return Response.InternalServerError(user.value.message);
  }
}
