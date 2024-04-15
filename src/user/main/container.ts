import { diContainer } from "@/containers";
import { UserDatabase } from "@/user/applications/user.database";
import { RegisterController } from "@/user/infrastructure/controllers/register.controller";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/users-mocked.database";
import { UserRepository } from "@/user/infrastructure/repositories/user.repository";
import { UserPostgresDatabase } from "../infrastructure/gateways/users-postgres.database";

if (process.env.NODE_ENV === "test") {
  diContainer.bind(UserDatabase).to(UserMockedDatabase);
} else {
  diContainer.bind(UserDatabase).to(UserPostgresDatabase);
}
diContainer.bind(UserRepository).toSelf();
diContainer.bind(RegisterController).toSelf();
