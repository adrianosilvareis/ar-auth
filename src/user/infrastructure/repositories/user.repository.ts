import { UserApplication } from '@/user/applications/user.application';
import { UserDatabase } from '@/user/applications/user.database';
import { UserMissInfo, UserProps } from '@/user/applications/user.props';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository {

  constructor(@inject(UserDatabase) private readonly db: UserDatabase) {}

  register(props: UserProps): UserMissInfo {
    const app =UserApplication.create(props);
    this.db.add(app)
    return app.getMissInfo();
  }
}