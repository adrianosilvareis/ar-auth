import { Either } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import {
  UserLoginProps,
  UserLoginResponse,
  UserMissInfo,
  UserProps
} from "./user.props";

export abstract class UserRegisterRepository {
  abstract register(
    props: UserProps
  ): Promise<Either<InternalServerError | UniqueConstraintError, UserMissInfo>>;
}

export abstract class UserLoginRepository {
  abstract login(
    props: UserLoginProps
  ): Promise<
    Either<InternalServerError | UnauthorizedError, UserLoginResponse>
  >;
}
