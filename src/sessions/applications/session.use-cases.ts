import { Either } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { UserApplication } from "@/user/applications/user.application";
import { JWTToken } from "@/user/applications/user.types";

export abstract class RegisterSessionUseCase {
  abstract registerSession(
    userId: string,
    token: JWTToken,
    refreshToken: JWTToken
  ): Promise<Either<InternalServerError, void>>;
}

export abstract class VerifySessionUseCase {
  abstract verifySession(
    token: string
  ): Promise<
    Either<
      InternalServerError | InvalidTokenError | ExpiredTokenError,
      UserApplication
    >
  >;
}
