export interface UserProps {
  name: string;
  email: string;
  password: string;
  id?: string;
}

export interface UserNewProps {
  name: string;
  email: string;
  password: string;
}

export interface UserMissInfo {
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
