import { Either, left, right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.errors";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { UserMissInfo, UserProps } from "@/user/applications/user.props";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository {
  constructor(@inject(UserDatabase) private readonly db: UserDatabase) {}

  async register(
    props: UserProps
  ): Promise<Either<InternalServerError, UserMissInfo>> {
    try {
      const app = UserApplication.create(props);
      await this.db.add(app);
      return right(app.getMissInfo());
    } catch (error: any) {
      if (error.code === "P2002") {
        return left(new UniqueConstraintError(error.meta?.target.pop()));
      }
      return left(new InternalServerError(error.message));
    }
  }
}
