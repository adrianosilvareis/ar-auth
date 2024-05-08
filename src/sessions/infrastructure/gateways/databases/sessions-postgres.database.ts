import { SessionApplication } from "@/sessions/applications/session.application";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class SessionPostgresDatabase implements SessionDatabase {
  connect = new PrismaClient();

  async dropActiveSessions(userId: string): Promise<void> {
    await this.connect.session.updateMany({
      where: {
        userId
      },
      data: {
        active: false
      }
    });
  }

  async createNewSessions(
    userId: string,
    token: string,
    refreshToken: string,
    userAgent: string
  ): Promise<void> {
    await this.connect.session.create({
      data: {
        token,
        refreshToken,
        userId,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        userAgent
      }
    });
  }

  async findSession(
    token: string,
    userAgent: string
  ): Promise<SessionApplication | null> {
    const session = await this.connect.session.findFirst({
      where: {
        token,
        userAgent,
        active: true
      }
    });

    if (!session) {
      return null;
    }

    return SessionApplication.create(session as any);
  }
}
