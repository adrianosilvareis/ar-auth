import { SessionApplication } from "./session.application";

export abstract class SessionDatabase {
  abstract dropActiveSessions(userId: string): Promise<void>;
  abstract createNewSessions(
    userId: string,
    token: string,
    refreshToken: string,
    userAgent: string
  ): Promise<void>;

  abstract findSession(
    token: string,
    userAgent: string
  ): Promise<SessionApplication | null>;
}
