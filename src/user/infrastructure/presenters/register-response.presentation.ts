import { UserApplication } from "@/user/applications/user.application";
import { UserRegisterResponse } from "@/user/applications/user.props";

export class RegisterResponsePresentation implements UserRegisterResponse {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;

  constructor(app: UserApplication) {
    this.id = app.id;
    this.name = app.name;
    this.email = app.email;
  }

  static parse(app: UserApplication): RegisterResponsePresentation {
    return new RegisterResponsePresentation(app);
  }
}
