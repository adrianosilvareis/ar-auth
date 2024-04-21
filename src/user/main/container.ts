import { diContainer } from "@/containers";

import { EncryptHash } from "@/user//infrastructure/services/encrypt/encrypt-hash";
import { Encrypt } from "@/user/applications/encrypt.protocols";
import { UserDatabase } from "@/user/applications/user.database";
import {
  UserLoginRepository,
  UserRegisterRepository
} from "@/user/applications/user.repository";
import { UserToken } from "@/user/applications/user.token";
import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";
import { UserPostgresDatabase } from "@/user/infrastructure/gateways/databases/users-postgres.database";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
import { EncryptMock } from "@/user/infrastructure/services/encrypt/encrypt-mock";
import { JWTUserToken } from "@/user/infrastructure/services/user-token/jwt-user.token";

if (process.env.NODE_ENV === "test") {
  diContainer.bind(UserDatabase).to(UserMockedDatabase).inSingletonScope();
  diContainer.bind(Encrypt).to(EncryptMock);
} else {
  diContainer.bind(UserDatabase).to(UserPostgresDatabase);
  diContainer.bind(Encrypt).to(EncryptHash);
}

diContainer.bind(UserRegisterRepository).to(UserRepository);
diContainer.bind(UserLoginRepository).to(UserRepository);
diContainer.bind(RegisterController).toSelf();
diContainer.bind(LoginController).toSelf();
diContainer.bind(UserToken).to(JWTUserToken);
