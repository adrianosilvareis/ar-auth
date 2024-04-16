import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRegisterRepository } from "@/user/applications/user.repository";
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
    @inject(UserRegisterRepository)
    private readonly repository: UserRegisterRepository,
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
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(error.message);
        return Response.BadRequest(error.message);
      } else {
        this.logger.error(error.message);
        return Response.InternalServerError(error.message);
      }
    }
    this.logger.info("RegisterController.handler - end");
    return Response.Ok(user.value);
  }
}
