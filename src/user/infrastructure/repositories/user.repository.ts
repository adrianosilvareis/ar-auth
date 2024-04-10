import { UserApplication } from '@/user/applications/user.application';
import { UserMissInfo, UserProps } from '@/user/applications/user.props';
import { UserDatabase } from '@/user/infrastructure/gateways/users.database';

export class UserRepository {
  
  constructor(private readonly db: UserDatabase) {}

  register(props: UserProps): UserMissInfo {
    const app = UserApplication.create(props);
    this.db.users.push(app);
    return app.getMissInfo();
  }
}