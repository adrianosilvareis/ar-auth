import { UserApplication } from '@/user/applications/user.application';

export abstract class UserDatabase {
  abstract getAll(): UserApplication[]
  abstract add(user: UserApplication): void
}