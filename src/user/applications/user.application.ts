import { v4 as uuid } from 'uuid';
import { User } from "../domain/user";
import { UserMissInfo, UserProps } from "./user.props";
import { JWTToken } from "./user.types";

export class UserApplication extends User {
  private _token?: JWTToken;
  private _id?: string;

  get token(): JWTToken | undefined {
    return this._token
  }
  
  get id(): string {
    return this._id as string
  };

  private constructor(props: UserProps) {
    super(props.name, props.email, props.password);
  }

  genToken():void {
    this._token = 'JWT_TOKEN'
  }

  getMissInfo(): UserMissInfo {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    }
  }

  static create(props: UserProps): UserApplication {
    const app = new UserApplication(props);
    app._id = props.id ?? uuid();
    return app
  }
}