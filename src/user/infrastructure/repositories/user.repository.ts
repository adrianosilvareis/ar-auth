import { Either, left, right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { NotFoundError } from "@/protocols/either/errors/not-found.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { Encrypt } from "@/user/applications/encrypt.protocols";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import {
  UserLoginProps,
  UserLoginResponse,
  UserMissInfo,
  UserProps
} from "@/user/applications/user.props";
import {
  UserLoginRepository,
  UserRegisterRepository
} from "@/user/applications/user.repository";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository
  implements UserRegisterRepository, UserLoginRepository
{
  constructor(
    @inject(UserDatabase) private readonly db: UserDatabase,
    @inject(Encrypt) private readonly encrypt: Encrypt
  ) {}

  async register(
    props: UserProps
  ): Promise<Either<InternalServerError, UserMissInfo>> {
    try {
      const password = await this.encrypt.hashPassword(props.password);
      const app = UserApplication.create(Object.assign(props, { password }));
      await this.db.add(app);
      return right(app.getMissInfo());
    } catch (error: any) {
      return left(error);
    }
  }

  async login(
    props: UserLoginProps
  ): Promise<
    Either<InternalServerError | UnauthorizedError, UserLoginResponse>
  > {
    try {
      const user = await this.db.findOne({ email: props.email });

      const isMatch = await this.encrypt.comparePasswords(
        props.password,
        user.password
      );

      if (!isMatch) {
        return left(new UnauthorizedError("Invalid password"));
      }

      const token = user.genToken();
      const refreshToken = props.remember ? user.genRefreshToken() : undefined;

      return right({
        token,
        refreshToken
      });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return left(new UnauthorizedError(error.message));
      }
      return left(new InternalServerError(error.message));
    }
  }
}
