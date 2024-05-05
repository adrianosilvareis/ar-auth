import { Cache } from "@/cache/cache";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { NotFoundError } from "@/protocols/either/errors/not-found.error";
import { UniqueConstraintError } from "@/protocols/either/errors/unique-constraint-error.ts";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class UserPostgresDatabase implements UserDatabase {
  connect = new PrismaClient();

  constructor(
    @inject(Cache) private readonly cache: Cache<string, UserApplication>
  ) {}

  async getAll(): Promise<UserApplication[]> {
    const users = await this.connect.user.findMany();
    return users.map((user) => UserApplication.create(user));
  }

  async add(user: UserApplication): Promise<void> {
    try {
      await this.connect.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password
        }
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new UniqueConstraintError(error.meta?.target.pop());
      }
      throw new InternalServerError(error.message);
    }
  }

  async findOneByEmail(params: any): Promise<UserApplication> {
    const cacheKey = `user:${params.email}`;
    const cachedUser = this.cache.get(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.connect.user.findUnique({
      where: {
        email: params.email
      }
    });

    if (!user) {
      return Promise.reject(new NotFoundError("User not found"));
    }

    const foundUser = UserApplication.create(user);

    this.cache.set(cacheKey, foundUser);

    return foundUser;
  }
}
