import "@/logger-config";
import "@/sessions/main/container";

import { left, right } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";

import { Logger } from "@/logger/logger";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { VerifySessionRepository } from "@/sessions/infrastructure/repositories/verify-session.repository";
import { UserApplication } from "@/user/applications/user.application";

Logger.pause();

describe("VerifySessionRepository", () => {
  let repository: VerifySessionRepository;
  let sessionDatabase: SessionDatabase;

  beforeEach(() => {
    sessionDatabase = {
      findSession: jest.fn(),
      createNewSessions: jest.fn(),
      dropActiveSessions: jest.fn()
    };
    repository = new VerifySessionRepository(sessionDatabase);
  });

  describe("verifySession", () => {
    it("should return user application when session is valid", async () => {
      const token = "valid-token";
      const userAgent = "my-device-name";

      const session = {
        userId: "user-id",
        isExpired: jest.fn().mockReturnValue(false)
      };
      const expectedUser = UserApplication.create({} as any, session.userId);
      expectedUser.session = session as any;

      sessionDatabase.findSession = jest.fn().mockResolvedValue(session);

      const result = await repository.verifySession(token, userAgent);

      expect(result).toEqual(right(expectedUser));
      expect(sessionDatabase.findSession).toHaveBeenCalledWith(
        token,
        userAgent
      );
    });

    it("should return InvalidTokenError when session is not found", async () => {
      const token = "invalid-token";
      const userAgent = "my-device-name";

      sessionDatabase.findSession = jest.fn().mockResolvedValue(null);

      const result = await repository.verifySession(token, userAgent);

      expect(result).toEqual(left(new InvalidTokenError()));
      expect(sessionDatabase.findSession).toHaveBeenCalledWith(
        token,
        userAgent
      );
    });

    it("should return ExpiredTokenError when session is expired", async () => {
      const token = "expired-token";
      const userAgent = "my-device-name";

      const session = {
        isExpired: jest.fn().mockReturnValue(true)
      };

      sessionDatabase.findSession = jest.fn().mockResolvedValue(session);

      const result = await repository.verifySession(token, userAgent);

      expect(result).toEqual(left(new ExpiredTokenError()));
      expect(sessionDatabase.findSession).toHaveBeenCalledWith(
        token,
        userAgent
      );
    });

    it("should return InternalServerError when an error occurs", async () => {
      const token = "error-token";
      const userAgent = "my-device-name";
      const errorMessage = "Internal server error";

      sessionDatabase.findSession = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      const result = await repository.verifySession(token, userAgent);

      expect(result).toEqual(left(new InternalServerError(errorMessage)));
      expect(sessionDatabase.findSession).toHaveBeenCalledWith(
        token,
        userAgent
      );
    });
  });
});
