import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserMissInfo, UserNewProps } from "@/user/applications/user.props";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
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
    this.logger.info("handler RegisterController");

    if (request.isLeft()) {
      this.logger.warn("Register Controller BadRequest");
      return Response.BadRequest(request.value.issues);
    }

    const user = await this.repository.register(request.value);
    if (user.isLeft()) {
      this.logger.warn("Register Controller - Internal Server Error");
      return Response.InternalServerError(user.value.message);
    }

    return Response.Ok(user.value);
  }
}
