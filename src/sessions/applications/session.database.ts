import { SessionApplication } from "./session.application";

export abstract class SessionDatabase {
  abstract dropActiveSessions(userId: string): Promise<void>;
  abstract createNewSessions(
    userId: string,
    token: string,
    refreshToken: string
  ): Promise<void>;

  abstract findSession(token: string): Promise<SessionApplication | null>;
}
