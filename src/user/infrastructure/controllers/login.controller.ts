import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { BadRequestError } from "@/protocols/either/errors/bad-request.errors";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.errors";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserLoginProps } from "@/user/applications/user.props";
import { UserLoginRepository } from "@/user/applications/user.repository";
import { JWTToken } from "@/user/applications/user.types";
import { inject, injectable } from "inversify";
import { z } from "zod";

const RequestSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

@injectable()
export class LoginController
  implements Controller<UserLoginProps, { token: JWTToken }>
{
  constructor(
    @inject(UserLoginRepository)
    private readonly repository: UserLoginRepository,
    @inject(Logger) private readonly logger: Logger
  ) {}

  @ValidateWith(RequestSchema)
  async handler(
    request: Either<z.ZodError, UserLoginProps>
  ): Promise<HttpResponse<{ token: JWTToken }>> {
    this.logger.info("LoginController.handler - start");
    if (request.isLeft()) {
      this.logger.warn("Login Controller BadRequest");
      return Response.BadRequest(request.value.issues);
    }
    const token = await this.repository.login(request.value);
    if (token.isLeft()) {
      const error = token.value;
      if (error instanceof BadRequestError) {
        this.logger.warn(error.message);
        return Response.BadRequest(error.message);
      } else if (error instanceof UnauthorizedError) {
        this.logger.warn(error.message);
        return Response.Unauthorized("User Unauthorized");
      } else {
        this.logger.error(error.message);
        return Response.InternalServerError(error.message);
      }
    }
    this.logger.info("LoginController.handler - end");
    return Response.Ok({ token: token.value });
  }
}
