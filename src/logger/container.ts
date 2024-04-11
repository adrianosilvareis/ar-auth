import { Container } from "inversify";
import { Logger } from "./logger";

export const container = new Container();

container.bind(Logger).toSelf();
