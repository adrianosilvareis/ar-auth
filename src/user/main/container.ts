import { diContainer } from "@/containers";

import { EncryptHash } from "@/user//infrastructure/services/encrypt/encrypt-hash";
import { Encrypt } from "@/user/applications/encrypt.protocols";
import { UserDatabase } from "@/user/applications/user.database";
import { UserToken } from "@/user/applications/user.token";
import {
  UserLoginUseCase,
  UserRegisterUseCase
} from "@/user/applications/user.use-cases";
import { LoginController } from "@/user/infrastructure/controllers/login.controller";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";
import { UserPostgresDatabase } from "@/user/infrastructure/gateways/databases/users-postgres.database";
import { LoginRepository } from "@/user/infrastructure/repositories/login.repository";
import { RegisterRepository } from "@/user/infrastructure/repositories/register.repository";
import { EncryptMock } from "@/user/infrastructure/services/encrypt/encrypt-mock";
import { JWTUserToken } from "@/user/infrastructure/services/user-token/jwt-user.token";
import { RefreshTokenController } from "../infrastructure/controllers/refresh-token.controller";
import { MockUserToken } from "../infrastructure/services/user-token/mock-user.token";

if (process.env.NODE_ENV === "test") {
  diContainer.bind(UserDatabase).to(UserMockedDatabase).inSingletonScope();
  diContainer.bind(Encrypt).to(EncryptMock).inSingletonScope();
  diContainer.bind(UserToken).to(MockUserToken).inSingletonScope();
} else {
  diContainer.bind(UserDatabase).to(UserPostgresDatabase);
  diContainer.bind(Encrypt).to(EncryptHash);
  diContainer.bind(UserToken).to(JWTUserToken);
}

diContainer.bind(UserRegisterUseCase).to(RegisterRepository);
diContainer.bind(UserLoginUseCase).to(LoginRepository);
diContainer.bind(RefreshTokenController).toSelf();
diContainer.bind(RegisterController).toSelf();
diContainer.bind(LoginController).toSelf();
