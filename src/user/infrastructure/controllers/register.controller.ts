import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "inversify";
import { z } from "zod";

const RequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

@injectable()
export class RegisterController
  implements Controller<UserNewProps, UserMissInfo>
{
  constructor(
    @inject(UserRepository) private readonly repository: UserRepository,
    @inject(Logger) private readonly logger: Logger
  ) {}

  @ValidateWith(RequestSchema)
  async handler(
    request: Either<z.ZodError, UserNewProps>
  ): Promise<HttpResponse<UserMissInfo>> {
    this.logger.info("RegisterController.handler - start");

    if (request.isLeft()) {
      this.logger.warn("Register Controller BadRequest");
      return Response.BadRequest(request.value.issues);
    }

    const user = await this.repository.register(request.value);

    if (user.isLeft()) {
      const error = user.value;
      if (error.name === getReasonPhrase(StatusCodes.BAD_REQUEST)) {
        const errorMessage = `Register Controller BadRequest: ${error.message}`;
        this.logger.warn(errorMessage);
        return Response.BadRequest(errorMessage);
      } else {
        const errorMessage = `Register Controller InternalServerError: ${error.message}`;
        this.logger.error(errorMessage);
        return Response.InternalServerError(errorMessage);
      }
    }
    this.logger.info("RegisterController.handler - end");
    return Response.Ok(user.value);
  }
}
