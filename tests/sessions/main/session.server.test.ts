import { diContainer } from "@/containers";
import "@/sessions/main/container";

import "@/logger-config";

import { Cache } from "@/cache/cache";
import { app } from "@/express.config";
import { Logger } from "@/logger/logger";
import { right } from "@/protocols/either/either";
import { SessionApplication } from "@/sessions/applications/session.application";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { SessionMockedDatabase } from "@/sessions/infrastructure/gateways/databases/sessions-mocked.database";
import { appSession } from "@/sessions/main/session.server";
import { UserDatabase } from "@/user/applications/user.database";
import { UserToken } from "@/user/applications/user.token";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";
import { appUser } from "@/user/main/user.server";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

Logger.pause();

appSession(app);
appUser(app);

const database = diContainer.get(UserDatabase) as UserMockedDatabase;
const sessionDatabase = diContainer.get(
  SessionDatabase
) as SessionMockedDatabase;
const cache = diContainer.get(Cache);

const supertest = request(app);

jest.mock("uuid", () => ({
  v4: jest.fn(() => "UUID")
}));

describe("Session Controller", () => {
  beforeEach(() => {
    cache.clear();
    database.users = [];
    sessionDatabase.sessions = [];
  });

  describe("GET /user/refresh-token", () => {
    it("should return status 401 when authorization token is not provided", async () => {
      const response = await supertest.get("/refresh-token");

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toBe("Unauthorized");
    });

    it("should return status 401 when authorization token is invalid", async () => {
      const token = "invalid token";
      const response = await supertest
        .get("/refresh-token")
        .set("Authorization", `bearer ${token}`);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual({ name: "InvalidTokenError" });
    });

    it("should return status 401 when authorization token is invalid", async () => {
      const managerToken = diContainer.get(UserToken);
      managerToken.refreshToken = jest
        .fn()
        .mockReturnValueOnce(right("new_token"));
      diContainer.rebind(UserToken).toConstantValue(managerToken);

      sessionDatabase.sessions = [
        SessionApplication.create({
          id: "UUID",
          userId: "UUID",
          token: "token",
          refreshToken: "refreshToken",
          createdAt: new Date(),
          active: true,
          userAgent: "user-agent",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        })
      ];

      const token = "token";
      const response = await supertest
        .get("/refresh-token")
        .set("Authorization", `bearer ${token}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual({ token: "new_token" });
    });
  });
});
