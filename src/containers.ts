import "reflect-metadata";

import { Container } from "inversify";
import { Cache } from "./cache/cache";

export const diContainer = new Container();

diContainer.bind(Cache).toSelf().inSingletonScope();
