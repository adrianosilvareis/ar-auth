import { Either, left, right } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { UserToken } from "@/user/applications/user.token";
import { JWTToken } from "@/user/applications/user.types";
import { injectable } from "inversify";

@injectable()
export class MockUserToken<T> implements UserToken<T> {
  token = "mocked_token";
  tokenRefreshed = "mocked_token_refreshed";
  isRight = true;
  payload: any = {};
  leftError!: Error;

  generateToken(payload: T, expiresIn?: string): JWTToken {
    return this.token;
  }

  verifyToken(
    token: JWTToken
  ): Either<InvalidTokenError | ExpiredTokenError, T> {
    if (this.isRight) {
      return right(this.payload);
    }
    return left(this.leftError);
  }

  refreshToken(token: JWTToken): Either<InvalidTokenError, JWTToken> {
    if (this.isRight) {
      return right(this.tokenRefreshed);
    }
    return left(this.leftError);
  }
}
