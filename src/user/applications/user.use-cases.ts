import { Either } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { User } from "@/user/domain/user";
import { RegisterResponsePresentation } from "../infrastructure/presenters/register-response.presentation";
import { UserLoginProps, UserRepositoryLoginResponse } from "./user.props";

export abstract class UserRegisterUseCase {
  abstract register(
    props: User
  ): Promise<
    Either<
      InternalServerError | UniqueConstraintError,
      RegisterResponsePresentation
    >
  >;
}

export abstract class UserLoginUseCase {
  abstract login(
    props: UserLoginProps
  ): Promise<
    Either<InternalServerError | UnauthorizedError, UserRepositoryLoginResponse>
  >;
}
