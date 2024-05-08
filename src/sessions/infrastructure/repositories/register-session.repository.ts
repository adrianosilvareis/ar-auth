import { Either, left, right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { RegisterSessionUseCase } from "@/sessions/applications/session.use-cases";
import { JWTToken } from "@/user/applications/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class RegisterSessionRepository implements RegisterSessionUseCase {
  constructor(@inject(SessionDatabase) private readonly db: SessionDatabase) {}

  async registerSession(
    userId: string,
    token: JWTToken,
    refreshToken: JWTToken,
    userAgent: string
  ): Promise<Either<InternalServerError, void>> {
    try {
      await this.db.dropActiveSessions(userId);
      await this.db.createNewSessions(userId, token, refreshToken, userAgent);
      return right(undefined);
    } catch (error: any) {
      return left(new InternalServerError(error.message));
    }
  }
}
