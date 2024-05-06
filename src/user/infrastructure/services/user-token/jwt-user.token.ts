import { Either, left, right } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { UserToken } from "@/user/applications/user.token";
import { JWTToken } from "@/user/applications/user.types";
import { randomUUID } from "crypto";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JWTUserToken<T extends jwt.JwtPayload> implements UserToken<T> {
  private _secret!: string;

  constructor() {
    this._secret = process.env.JWT_SECRET ?? randomUUID();
  }

  set secret(secret: string) {
    this._secret = secret;
  }

  generateToken(payload: T, expiresIn: string = "1h"): JWTToken {
    return jwt.sign(payload, this._secret, { expiresIn });
  }

  verifyToken(
    token: JWTToken
  ): Either<InvalidTokenError | ExpiredTokenError, T> {
    try {
      const payload = jwt.verify(token, this._secret) as T;
      return right(payload);
    } catch (error: any) {
      if (error.message === "jwt malformed") {
        return left(new InvalidTokenError());
      }
      if (error.message === "jwt expired") {
        return left(new ExpiredTokenError());
      }
      return left(error as Error);
    }
  }

  refreshToken(
    token: JWTToken
  ): Either<InvalidTokenError | ExpiredTokenError, JWTToken> {
    const decoded = this.verifyToken(token);

    if (decoded.isLeft()) {
      return left(decoded.extract());
    }
    const payload = decoded.extract();
    delete payload.iat;
    delete payload.exp;

    return right(this.generateToken(payload));
  }
}
