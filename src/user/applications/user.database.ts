import { UserApplication } from "@/user/applications/user.application";

export abstract class UserDatabase {
  abstract getAll(): Promise<UserApplication[]>;
  abstract add(user: UserApplication): Promise<void>;
  abstract findOneByEmail(params: any): Promise<UserApplication>;
}
