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
  token: string;
  refreshToken?: string;
}
