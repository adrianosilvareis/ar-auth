import "@/user/main/container";

import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { UserToken } from "@/user/applications/user.token";
import { JWTUserToken } from "@/user/infrastructure/services/user-token/jwt-user.token";

function removeJwtProps(value: any) {
  value as { [key: string]: any };
  delete value.exp;
  delete value.iat;
  return value;
}

describe("JWTUserToken", () => {
  let jwtUserToken: UserToken<any>;

  beforeEach(() => {
    jwtUserToken = new JWTUserToken();
  });

  it("should generate a token", () => {
    const payload = { userId: "123" };
    const token = jwtUserToken.generateToken(payload);
    expect(token).toBeDefined();
  });

  it("should verify a valid token", () => {
    const payload = { userId: "123" };
    const token = jwtUserToken.generateToken(payload);
    const result = jwtUserToken.verifyToken(token);
    expect(result.isRight()).toBe(true);
    expect(removeJwtProps(result.extract())).toEqual(payload);
  });

  it("should return an error for an invalid token", () => {
    const invalidToken = "invalid_token";
    const result = jwtUserToken.verifyToken(invalidToken);
    expect(result.isLeft()).toBe(true);
    expect(removeJwtProps(result.extract())).toBeInstanceOf(InvalidTokenError);
  });

  it("should return an error for an expired token", () => {
    const expiredToken = jwtUserToken.generateToken({ userId: "123" }, "-11s");
    const result = jwtUserToken.verifyToken(expiredToken);
    expect(result.isLeft()).toBe(true);
    expect(removeJwtProps(result.extract())).toBeInstanceOf(ExpiredTokenError);
  });

  it("should refresh a token", () => {
    const payload = { userId: "123" };

    const token = jwtUserToken.generateToken(payload);
    const refreshedToken = jwtUserToken.refreshToken(token);
    expect(refreshedToken).toBeDefined();
    expect(refreshedToken).not.toBe(token);
  });

  it("should return an error for an invalid token", () => {
    const invalidToken = "invalid_token";
    const refreshedToken = jwtUserToken.refreshToken(invalidToken);
    expect(refreshedToken.isLeft()).toBe(true);
    expect(removeJwtProps(refreshedToken.extract())).toBeInstanceOf(
      InvalidTokenError
    );
  });
});
