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