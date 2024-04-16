import { Either } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.errors";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.errors";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { UserLoginProps, UserMissInfo, UserProps } from "./user.props";
import { JWTToken } from "./user.types";

export abstract class UserRegisterRepository {
  abstract register(
    props: UserProps
  ): Promise<Either<InternalServerError | UniqueConstraintError, UserMissInfo>>;
}

export abstract class UserLoginRepository {
  abstract login(
    props: UserLoginProps
  ): Promise<Either<InternalServerError | UnauthorizedError, JWTToken>>;
}
