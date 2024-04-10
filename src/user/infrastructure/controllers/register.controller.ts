import { Controller } from "@/protocols/controllers";
import { Request } from "@/protocols/http-request";
import { HttpResponse, Response } from "@/protocols/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";

export class RegisterController implements Controller<UserNewProps, UserMissInfo> {

  constructor(private readonly repository: UserRepository) {}

  handler(req: Request<UserNewProps>, res: Response<UserMissInfo>): HttpResponse<UserMissInfo> {
    const user = this.repository.register(req.body);
    return res.Ok(user);
  }
}