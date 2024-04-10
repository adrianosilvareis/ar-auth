import { UserMockedDatabase } from '@/user/infrastructure/gateways/users-mocked.database';
import { Container } from 'inversify';
import { UserDatabase } from '../applications/user.database';
import { RegisterController } from '../infrastructure/controllers/register.controller';
import { UserRepository } from '../infrastructure/repositories/user.repository';

export const container = new Container();

container.bind(UserDatabase).to(UserMockedDatabase);
container.bind(UserRepository).toSelf();
container.bind(RegisterController).toSelf();