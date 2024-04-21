import { Encrypt } from "@/user/applications/encrypt.protocols";
import bcrypt from "bcryptjs";
import { injectable } from "inversify";

@injectable()
export class EncryptHash implements Encrypt {
  private saltRounds: number = process.env.ENCRYPT_SALTS
    ? Number(process.env.ENCRYPT_SALTS)
    : 12;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
