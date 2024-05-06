import { Logger } from "@/logger/logger";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import {
  RegisterSessionUseCase,
  VerifySessionUseCase
} from "@/sessions/applications/session.use-cases";
import { JWTToken } from "@/user/applications/user.types";
import { User } from "@/user/domain/user";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshTokenController
  implements Controller<User, { token: JWTToken }>
{
  private logger!: Logger;

  constructor(
    @inject(VerifySessionUseCase)
    private readonly session: VerifySessionUseCase,
    @inject(RegisterSessionUseCase)
    private readonly register: RegisterSessionUseCase
  ) {
    this.logger = Logger.getLogger(RefreshTokenController);
  }

  async handler(request: any): Promise<HttpResponse<{ token: JWTToken }>> {
    this.logger.info("start RefreshToken", { request });

    if (request.headers.authorization === undefined) {
      return Response.Unauthorized("Unauthorized");
    }

    const [, authorization] = request.headers.authorization.split(" ");

    const user = await this.session.verifySession(authorization);

    if (user.isLeft()) {
      return Response.Unauthorized(user.extract());
    }
    const refreshToken = user.extract().session?.refreshToken as JWTToken;

    const token = user.extract().updateToken(refreshToken);

    if (token.isLeft()) {
      return Response.Unauthorized(token.extract().message);
    }

    const session = await this.register.registerSession(
      user.extract().id,
      token.extract(),
      refreshToken
    );

    if (session.isLeft()) {
      return Response.InternalServerError(session.extract().message);
    }

    return Response.Ok({
      token: token.extract()
    });
  }
}
