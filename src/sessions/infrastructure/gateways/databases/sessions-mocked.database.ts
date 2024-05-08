import { SessionApplication } from "@/sessions/applications/session.application";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { injectable } from "inversify";

@injectable()
export class SessionMockedDatabase implements SessionDatabase {
  sessions: SessionApplication[] = [];

  findSession(token: string): Promise<SessionApplication | null> {
    const session = this.sessions.find((session) => {
      return session.token === token && session.isActive();
    });

    if (!session) {
      return Promise.resolve(null);
    }

    return Promise.resolve(session);
  }
  dropActiveSessions(userid: string): Promise<void> {
    this.sessions = this.sessions
      .filter(({ userId }) => userId === userid)
      .map((session) =>
        SessionApplication.create({
          ...session,
          id: "",
          createdAt: new Date(),
          active: false
        })
      );

    return Promise.resolve();
  }

  createNewSessions(
    userId: string,
    token: string,
    refreshToken: string,
    userAgent: string
  ): Promise<void> {
    this.sessions.push(
      SessionApplication.create({
        id: "",
        userId,
        token,
        refreshToken,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        active: true,
        userAgent,
        createdAt: new Date()
      })
    );

    return Promise.resolve();
  }
}
