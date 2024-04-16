import { Either, left, right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.errors";
import { NotFoundError } from "@/protocols/either/errors/not-found.errors";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.errors";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import {
  UserLoginProps,
  UserMissInfo,
  UserProps
} from "@/user/applications/user.props";
import {
  UserLoginRepository,
  UserRegisterRepository
} from "@/user/applications/user.repository";
import { JWTToken } from "@/user/applications/user.types";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository
  implements UserRegisterRepository, UserLoginRepository
{
  constructor(@inject(UserDatabase) private readonly db: UserDatabase) {}

  async register(
    props: UserProps
  ): Promise<Either<InternalServerError, UserMissInfo>> {
    try {
      const app = UserApplication.create(props);
      await this.db.add(app);
      return right(app.getMissInfo());
    } catch (error: any) {
      return left(error);
    }
  }

  async login(
    props: UserLoginProps
  ): Promise<Either<InternalServerError | UnauthorizedError, JWTToken>> {
    try {
      const user = await this.db.findOne({ email: props.email });

      if (user.password !== props.password) {
        return left(new UnauthorizedError("Invalid password"));
      }

      const app = UserApplication.create(user);
      app.genToken();

      return right(app.token as JWTToken);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return left(new UnauthorizedError(error.message));
      }
      return left(new InternalServerError(error.message));
    }
  }
}
