export abstract class Encrypt {
  abstract hashPassword(password: string): Promise<string>;

  abstract comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean>;
}
