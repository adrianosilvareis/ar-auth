import { Either, left, right } from "@/protocols/either/either";
import { ExpiredTokenError } from "@/protocols/either/errors/expired-token.error";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { SessionDatabase } from "@/sessions/applications/session.database";
import { VerifySessionUseCase } from "@/sessions/applications/session.use-cases";
import { UserApplication } from "@/user/applications/user.application";
import { inject, injectable } from "inversify";

@injectable()
export class VerifySessionRepository implements VerifySessionUseCase {
  constructor(@inject(SessionDatabase) private readonly db: SessionDatabase) {}

  async verifySession(
    token: string
  ): Promise<
    Either<
      InternalServerError | InvalidTokenError | ExpiredTokenError,
      UserApplication
    >
  > {
    try {
      const session = await this.db.findSession(token);

      if (!session) {
        return left(new InvalidTokenError());
      }
      if (session.isExpired()) {
        return left(new ExpiredTokenError());
      }
      const user = UserApplication.create({} as any, session.userId);
      user.session = session;

      return right(user);
    } catch (error: any) {
      return left(new InternalServerError(error.message));
    }
  }
}
