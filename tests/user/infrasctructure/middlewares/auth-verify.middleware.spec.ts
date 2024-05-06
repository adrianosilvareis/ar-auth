import "@/user/main/container";

import { diContainer } from "@/containers";
import { UserToken } from "@/user/applications/user.token";
import { AuthVerifyMiddleware } from "@/user/infrastructure/middlewares/auth-verify.middleware";
import { MockUserToken } from "@/user/infrastructure/services/user-token/mock-user.token";
import { Request, Response } from "express";
import { getStatusCode } from "http-status-codes";

describe("AuthVerifyMiddleware", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      headers: {}
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    next = jest.fn();
  });

  it("should return status 401 and error message when no token is provided", () => {
    AuthVerifyMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(getStatusCode("Unauthorized"));
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return status 401 and error message when token is not in the correct format", () => {
    req.headers = { authorization: "InvalidToken" };

    AuthVerifyMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(getStatusCode("Unauthorized"));
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return status 401 and error message when token verification fails", () => {
    const managerToken = diContainer.get(UserToken) as MockUserToken<{
      sub: string;
    }>;
    managerToken.isRight = false;

    req.headers = { authorization: "Bearer InvalidToken" };

    AuthVerifyMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(getStatusCode("Unauthorized"));
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should set userId in request body and call next() when token verification succeeds", () => {
    const managerToken = diContainer.get(UserToken);
    managerToken.verifyToken = jest.fn().mockReturnValueOnce({
      isLeft: () => false,
      extract: () => ({ sub: "user123" })
    });
    diContainer.rebind(UserToken).toConstantValue(managerToken);

    req.headers = { authorization: "Bearer ValidToken" };

    AuthVerifyMiddleware(req, res, next);

    expect(managerToken.verifyToken).toHaveBeenCalledWith("ValidToken");
    expect(req.body.userId).toBe("user123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
