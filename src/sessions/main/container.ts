import { diContainer } from "@/containers";

import { SessionDatabase } from "../applications/session.database";
import {
  RegisterSessionUseCase,
  VerifySessionUseCase
} from "../applications/session.use-cases";
import { RefreshTokenController } from "../infrastructure/controllers/refresh-token.controller";
import { SessionMockedDatabase } from "../infrastructure/gateways/databases/sessions-mocked.database";
import { SessionPostgresDatabase } from "../infrastructure/gateways/databases/sessions-postgres.database";
import { RegisterSessionRepository } from "../infrastructure/repositories/register-session.repository";
import { VerifySessionRepository } from "../infrastructure/repositories/verify-session.repository";

if (process.env.NODE_ENV === "test") {
  diContainer
    .bind(SessionDatabase)
    .to(SessionMockedDatabase)
    .inSingletonScope();
} else {
  diContainer.bind(SessionDatabase).to(SessionPostgresDatabase);
}

diContainer.bind(RegisterSessionUseCase).to(RegisterSessionRepository);
diContainer.bind(VerifySessionUseCase).to(VerifySessionRepository);
diContainer.bind(RefreshTokenController).toSelf();
