import { diContainer } from "@/containers";
import { UserToken } from "@/user/applications/user.token";
import { NextFunction, Request, Response } from "express";
import { getStatusCode } from "http-status-codes";

export function AuthVerifyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const managerToken = diContainer.get(UserToken<{ sub: string }>);

  const authorization = req.headers["authorization"];

  if (!authorization) {
    return res
      .status(getStatusCode("Unauthorized"))
      .json({ message: "No token provided" });
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(getStatusCode("Unauthorized"))
      .json({ message: "No token provided" });
  }

  const match = managerToken.verifyToken(token);

  if (match.isLeft()) {
    return res
      .status(getStatusCode("Unauthorized"))
      .json({ message: "Unauthorized" });
  }

  const { sub } = match.extract();
  req.body.userId = sub;

  next();
}
