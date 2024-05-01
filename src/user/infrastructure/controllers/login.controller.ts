import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { BadRequestError } from "@/protocols/either/errors/bad-request.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import {
  UserLoginProps,
  UserLoginResponse
} from "@/user/applications/user.props";
import { UserLoginRepository } from "@/user/applications/user.repository";
import { JWTToken } from "@/user/applications/user.types";
import { inject, injectable } from "inversify";
import { z } from "zod";

const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().default(false)
});

@injectable()
export class LoginController
  implements Controller<UserLoginProps, { token: JWTToken }>
{
  private logger!: Logger;

  constructor(
    @inject(UserLoginRepository)
    private readonly repository: UserLoginRepository
  ) {
    this.logger = Logger.getLogger(LoginController);
  }

  @ValidateWith(RequestSchema)
  async handler(
    request: Either<z.ZodError, UserLoginProps>
  ): Promise<HttpResponse<UserLoginResponse>> {
    this.logger.info("start login", { request });
    if (request.isLeft()) {
      this.logger.warn("bad request", { issues: request.extract().issues });
      return Response.BadRequest(request.extract().issues);
    }
    const token = await this.repository.login(request.extract());
    if (token.isLeft()) {
      const error = token.value;
      if (error instanceof BadRequestError) {
        this.logger.warn(error.message, { email: request.extract().email });
        return Response.BadRequest(error.message);
      } else if (error instanceof UnauthorizedError) {
        this.logger.warn(error.message, { email: request.extract().email });
        return Response.Unauthorized("User Unauthorized");
      } else {
        this.logger.error(error.message, { email: request.extract().email });
        return Response.InternalServerError(error.message);
      }
    }
    this.logger.info("end login");
    return Response.Ok(token.value);
  }
}
