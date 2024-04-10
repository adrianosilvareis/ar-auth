import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { injectable } from 'inversify';

@injectable()
export class UserMockedDatabase implements UserDatabase{
  users: UserApplication[] = [];

  getAll(): UserApplication[] {
    return this.users;
  }

  add(user: UserApplication) {
    this.users.push(user)
  }
}