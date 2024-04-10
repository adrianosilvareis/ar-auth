import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { injectable } from 'inversify';

@injectable()
export class UserMockedDatabase implements UserDatabase{
  users: UserApplication[] = [];

  async getAll(): Promise<UserApplication[]> {
    return Promise.resolve(this.users);
  }

  async add(user: UserApplication) {
    this.users.push(user)
  }
}