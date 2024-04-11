import { diContainer } from "@/containers";
import { UserDatabase } from "@/user/applications/user.database";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/users-mocked.database";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";

diContainer.bind(UserDatabase).to(UserMockedDatabase);
diContainer.bind(UserRepository).toSelf();
diContainer.bind(RegisterController).toSelf();
