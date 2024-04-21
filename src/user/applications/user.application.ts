import { diContainer } from "@/containers";
import { v4 as uuid } from "uuid";
import { User } from "../domain/user";
import { UserMissInfo, UserProps } from "./user.props";
import { UserToken } from "./user.token";
import { JWTToken } from "./user.types";

export class UserApplication extends User {
  private _token?: JWTToken;
  private _id?: string;

  get token(): JWTToken | undefined {
    return this._token;
  }

  get id(): string {
    return this._id as string;
  }

  private constructor(props: UserProps) {
    super(props.name, props.email, props.password);
  }

  genToken(): JWTToken {
    const managerToken = diContainer.get(UserToken);
    if (this._token) {
      const response = managerToken.refreshToken(this._token);
      if (response.isLeft()) {
        this._token = undefined;
        return this.genToken();
      }
      this._token = response.extract();
      return this._token;
    }
    this._token = managerToken.generateToken({ sub: this.id });
    return this._token;
  }

  getMissInfo(): UserMissInfo {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }

  static create(props: UserProps): UserApplication {
    const app = new UserApplication(props);
    app._id = props.id ?? uuid();
    return app;
  }
}
