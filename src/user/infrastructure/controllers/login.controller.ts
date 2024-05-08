import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { BadRequestError } from "@/protocols/either/errors/bad-request.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { Controller, IHeaders } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { RegisterSessionUseCase } from "@/sessions/applications/session.use-cases";
import {
  UserLoginProps,
  UserLoginResponse
} from "@/user/applications/user.props";
import { JWTToken } from "@/user/applications/user.types";
import { UserLoginUseCase } from "@/user/applications/user.use-cases";
import { inject, injectable } from "inversify";
import { z } from "zod";

const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().default(false)
});

@injectable()
export class LoginController
  implements Controller<UserLoginProps & IHeaders, { token: JWTToken }>
{
  private logger!: Logger;

  constructor(
    @inject(UserLoginUseCase)
    private readonly repository: UserLoginUseCase,
    @inject(RegisterSessionUseCase)
    private readonly session: RegisterSessionUseCase
  ) {
    this.logger = Logger.getLogger(LoginController);
  }

  @ValidateWith(RequestSchema)
  async handler(
    req: Either<z.ZodError, UserLoginProps & IHeaders>
  ): Promise<HttpResponse<UserLoginResponse>> {
    this.logger.info("start login", { request: req });
    if (req.isLeft()) {
      this.logger.warn("bad request", { issues: req.extract().issues });
      return Response.BadRequest(req.extract().issues);
    }

    const request = req.extract();
    const token = await this.repository.login(request);
    if (token.isLeft()) {
      const error = token.value;
      if (error instanceof BadRequestError) {
        this.logger.warn(error.message, { email: request.email });
        return Response.BadRequest(error.message);
      } else if (error instanceof UnauthorizedError) {
        this.logger.warn(error.message, { email: request.email });
        return Response.Unauthorized("User Unauthorized");
      } else {
        this.logger.error(error.message, { email: request.email });
        return Response.InternalServerError(error.message);
      }
    }
    const value = token.extract();

    const userAgent = request.headers?.["user-agent"] as string;
    const session = await this.session.registerSession(
      value.userId,
      value.token,
      value.refreshToken ?? "",
      userAgent
    );

    if (session.isLeft()) {
      this.logger.error(session.extract().message, {
        email: request.email
      });
      return Response.InternalServerError(session.extract().message);
    }

    this.logger.info("end login");
    return Response.Ok({ token: value.token });
  }
}
