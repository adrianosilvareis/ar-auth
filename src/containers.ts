import "reflect-metadata";

import { Logger } from "@/logger/logger";
import { Container } from "inversify";
import { Cache } from "./cache/cache";

export const diContainer = new Container();

diContainer.bind(Logger).toSelf();

diContainer.bind(Cache).toSelf().inSingletonScope();
