import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class UserPostgresDatabase implements UserDatabase {
  connect = new PrismaClient();

  async getAll(): Promise<UserApplication[]> {
    const users = await this.connect.user.findMany();
    return users.map((user) => UserApplication.create(user));
  }

  async add(user: UserApplication): Promise<void> {
    await this.connect.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password
      }
    });
  }
}
