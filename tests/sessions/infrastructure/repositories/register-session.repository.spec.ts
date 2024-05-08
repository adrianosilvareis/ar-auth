import "@/logger-config";
import "@/sessions/main/container";

import { Logger } from "@/logger/logger";
import { right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { RegisterSessionRepository } from "@/sessions/infrastructure/repositories/register-session.repository";
import { JWTToken } from "@/user/applications/user.types";

Logger.pause();

describe("RegisterSessionRepository", () => {
  let repository: RegisterSessionRepository;
  let sessionDatabaseMock: SessionDatabase;

  beforeEach(() => {
    sessionDatabaseMock = {
      dropActiveSessions: jest.fn(),
      createNewSessions: jest.fn(),
      findSession: jest.fn()
    };
    repository = new RegisterSessionRepository(sessionDatabaseMock);
  });

  describe("registerSession", () => {
    it("should register a new session and return right(undefined)", async () => {
      const userId = "user123";
      const token: JWTToken = "token123";
      const refreshToken: JWTToken = "refreshToken123";
      const userAgent = "myDeviceName";

      const result = await repository.registerSession(
        userId,
        token,
        refreshToken,
        userAgent
      );

      expect(sessionDatabaseMock.dropActiveSessions).toHaveBeenCalledWith(
        userId
      );
      expect(sessionDatabaseMock.createNewSessions).toHaveBeenCalledWith(
        userId,
        token,
        refreshToken,
        userAgent
      );
      expect(result).toEqual(right(undefined));
    });

    it("should return left(InternalServerError) when an error occurs", async () => {
      const userId = "user123";
      const token: JWTToken = "token123";
      const refreshToken: JWTToken = "refreshToken123";
      const userAgent = "myDeviceName";

      const errorMessage = "Database error";
      sessionDatabaseMock.createNewSessions = jest
        .fn()
        .mockRejectedValueOnce(new Error(errorMessage));

      const result = await repository.registerSession(
        userId,
        token,
        refreshToken,
        userAgent
      );

      expect(result.isLeft()).toBe(true);
      expect(result.extract()).toBeInstanceOf(InternalServerError);
      result.isLeft() && expect(result.extract().message).toBe(errorMessage);
    });
  });
});
