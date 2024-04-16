import { diContainer } from "@/containers";
import { UserDatabase } from "@/user/applications/user.database";
import {
  UserLoginRepository,
  UserRegisterRepository
} from "@/user/applications/user.repository";
import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/users-mocked.database";
import { UserPostgresDatabase } from "@/user/infrastructure/gateways/users-postgres.database";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";

if (process.env.NODE_ENV === "test") {
  diContainer.bind(UserDatabase).to(UserMockedDatabase).inSingletonScope();
} else {
  diContainer.bind(UserDatabase).to(UserPostgresDatabase);
}
diContainer.bind(UserRegisterRepository).to(UserRepository);
diContainer.bind(UserLoginRepository).to(UserRepository);
diContainer.bind(RegisterController).toSelf();
diContainer.bind(LoginController).toSelf();
