import { diContainer } from "@/containers";
import { Either } from "@/protocols/either/either";
import { InvalidTokenError } from "@/protocols/either/errors/invalid-token.errors";
import { SessionApplication } from "@/sessions/applications/session.application";
import { v4 as uuid } from "uuid";
import { User } from "../domain/user";
import { UserToken } from "./user.token";
import { JWTToken } from "./user.types";

export class UserApplication extends User {
  private _token?: JWTToken;
  private _id?: string;
  public session?: SessionApplication;

  get token(): JWTToken | undefined {
    return this._token;
  }

  get id(): string {
    return this._id as string;
  }

  private constructor(props: User) {
    super(props.name, props.email, props.password);
  }

  genToken(expiresIn?: string): JWTToken {
    const managerToken = diContainer.get(UserToken);
    this._token = managerToken.generateToken({ sub: this.id }, expiresIn);
    return this._token;
  }

  updateToken(token: string): Either<InvalidTokenError, JWTToken> {
    const managerToken = diContainer.get(UserToken);
    return managerToken.refreshToken(token);
  }

  static create(props: User, id: string = uuid()): UserApplication {
    const app = new UserApplication(props);
    app._id = id;
    return app;
  }
}
