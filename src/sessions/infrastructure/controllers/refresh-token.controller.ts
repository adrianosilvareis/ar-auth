import { Logger } from "@/logger/logger";
import { Controller, IHeaders } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import {
  RegisterSessionUseCase,
  VerifySessionUseCase
} from "@/sessions/applications/session.use-cases";
import { JWTToken } from "@/user/applications/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshTokenController
  implements Controller<IHeaders, { token: JWTToken }>
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

  async handler(req: IHeaders): Promise<HttpResponse<{ token: JWTToken }>> {
    this.logger.info("start RefreshToken", { request: req });

    const request = req.headers;

    if (request?.authorization === undefined) {
      return Response.Unauthorized("Unauthorized");
    }

    const userAgent = request["user-agent"] as string;
    const [, authorization] = request.authorization.split(" ");

    const user = await this.session.verifySession(authorization, userAgent);

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
      refreshToken,
      userAgent
    );

    if (session.isLeft()) {
      return Response.InternalServerError(session.extract().message);
    }

    return Response.Ok({
      token: token.extract()
    });
  }
}
