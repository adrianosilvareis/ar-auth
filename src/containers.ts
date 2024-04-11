import "reflect-metadata";

import { Logger } from "@/logger/logger";
import { Container } from "inversify";

export const diContainer = new Container();

diContainer.bind(Logger).toSelf();
