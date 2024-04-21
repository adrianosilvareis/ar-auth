import { Either } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { JWTToken } from "./user.types";

export abstract class UserToken<T> {
  abstract generateToken(payload: T, expiresIn?: string): JWTToken;
  abstract verifyToken(
    token: JWTToken
  ): Either<InvalidTokenError | ExpiredTokenError, T>;
  abstract refreshToken(token: JWTToken): Either<InvalidTokenError, JWTToken>;
}
