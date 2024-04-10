import { Either, left, right } from '@/protocols/either/either';
import { InternalServerError } from '@/protocols/either/errors/internal-server.errors';
import { UserApplication } from '@/user/applications/user.application';
import { UserDatabase } from '@/user/applications/user.database';
import { UserMissInfo, UserProps } from '@/user/applications/user.props';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository {

  constructor(@inject(UserDatabase) private readonly db: UserDatabase) {}

  async register(props: UserProps): Promise<Either<InternalServerError, UserMissInfo>> {
    try {
      const app = UserApplication.create(props);
      await this.db.add(app);  
      return right(app.getMissInfo());
    } catch (error: unknown) {
      return left(new InternalServerError((error as Error).message));
    }
  }
}