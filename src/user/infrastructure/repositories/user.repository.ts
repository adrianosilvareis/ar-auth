import { UserApplication } from '@/user/applications/user.application';
import { UserDatabase } from '@/user/applications/user.database';
import { UserMissInfo, UserProps } from '@/user/applications/user.props';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository {

  constructor(@inject(UserDatabase) private readonly db: UserDatabase) {}

  async register(props: UserProps): Promise<UserMissInfo> {
    const app = UserApplication.create(props);
    await this.db.add(app)
    return app.getMissInfo();
  }
}