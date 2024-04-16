import { NotFoundError } from "@/protocols/either/errors/not-found.errors";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { User } from "@/user/domain/user";
import { injectable } from "inversify";

@injectable()
export class UserMockedDatabase implements UserDatabase {
  users: UserApplication[] = [];

  async getAll(): Promise<UserApplication[]> {
    return Promise.resolve(this.users);
  }

  async add(user: UserApplication) {
    const found = this.users.find((u) => u.email === user.email);
    if (found) {
      throw new UniqueConstraintError("Email already exists");
    }
    this.users.push(user);
  }

  async findOne(params: User): Promise<UserApplication> {
    const keys = Object.keys(params) as (keyof User)[];

    const user = this.users.find((user) =>
      keys.every((key) => user[key] === params[key])
    );

    if (!user) {
      return Promise.reject(new NotFoundError("User not found"));
    }

    return Promise.resolve(user);
  }
}
