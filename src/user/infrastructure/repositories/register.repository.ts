import { Either, left, right } from "@/protocols/either/either";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { Encrypt } from "@/user/applications/encrypt.protocols";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { UserRegisterUseCase } from "@/user/applications/user.use-cases";
import { User } from "@/user/domain/user";
import { inject, injectable } from "inversify";
import { RegisterResponsePresentation } from "../presenters/register-response.presentation";

@injectable()
export class RegisterRepository implements UserRegisterUseCase {
  constructor(
    @inject(UserDatabase) private readonly db: UserDatabase,
    @inject(Encrypt) private readonly encrypt: Encrypt
  ) {}

  async register(
    props: User
  ): Promise<Either<InternalServerError, RegisterResponsePresentation>> {
    try {
      const password = await this.encrypt.hashPassword(props.password);
      const app = UserApplication.create(Object.assign(props, { password }));
      await this.db.add(app);
      return right(RegisterResponsePresentation.parse(app));
    } catch (error: any) {
      return left(error);
    }
  }
}
