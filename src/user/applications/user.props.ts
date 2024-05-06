import { JWTToken } from "./user.types";

export interface UserRegisterResponse {
  id: string;
  email: string;
  name: string;
}

export interface UserLoginProps {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UserLoginResponse {
  token: JWTToken;
}

export interface UserRepositoryLoginResponse {
  userId: string;
  token: JWTToken;
  refreshToken?: JWTToken;
}
