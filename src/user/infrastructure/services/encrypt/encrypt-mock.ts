import { Encrypt } from "@/user/applications/encrypt.protocols";
import { injectable } from "inversify";

@injectable()
export class EncryptMock implements Encrypt {
  async hashPassword(password: string): Promise<string> {
    return password;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return password === hashedPassword;
  }
}
