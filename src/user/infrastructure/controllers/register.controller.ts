import { Logger } from "@/logger/logger";
import { ValidateWith } from "@/protocols/decorators/validate-with";
import { Either } from "@/protocols/either/either";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { Controller } from "@/protocols/http/controllers";
import { HttpResponse, Response } from "@/protocols/http/http-response";
import { UserRegisterUseCase } from "@/user/applications/user.use-cases";
import { User } from "@/user/domain/user";
import { inject, injectable } from "inversify";
import { z } from "zod";
import { RegisterResponsePresentation } from "../presenters/register-response.presentation";

const RequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});

@injectable()
export class RegisterController
  implements Controller<User, RegisterResponsePresentation>
{
  private logger!: Logger;

  constructor(
    @inject(UserRegisterUseCase)
    private readonly repository: UserRegisterUseCase
  ) {
    this.logger = Logger.getLogger(RegisterController);
  }

  @ValidateWith(RequestSchema)
  async handler(
    request: Either<z.ZodError, User>
  ): Promise<HttpResponse<RegisterResponsePresentation>> {
    this.logger.info("start register", { request });

    if (request.isLeft()) {
      this.logger.warn("bad request", { issues: request.extract().issues });
      return Response.BadRequest(request.extract().issues);
    }

    const user = await this.repository.register(request.extract());

    if (user.isLeft()) {
      const error = user.value;
      if (error instanceof UniqueConstraintError) {
        this.logger.warn(error.message, { email: request.extract().email });
        return Response.BadRequest(error.message);
      } else {
        this.logger.error(error.message, { email: request.extract().email });
        return Response.InternalServerError(error.message);
      }
    }
    this.logger.info("end register", { user: user.extract() });
    return Response.Ok(user.value);
  }
}
