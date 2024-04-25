import { diContainer } from "@/containers";
import "@/logger-config";

import { Cache } from "@/cache/cache";
import { app } from "@/express.config";
import { Logger } from "@/logger/logger";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";
import { appUser } from "@/user/main/user.server";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

Logger.pause();

appUser(app);

const database = diContainer.get(UserDatabase) as UserMockedDatabase;
const cache = diContainer.get(Cache);

const supertest = request(app);

jest.mock("uuid", () => ({
  v4: jest.fn(() => "UUID")
}));

describe("User Controller", () => {
  beforeEach(() => {
    cache.clear();
    database.users = [];
  });

  describe("POST /user/register", () => {
    it("should return status 200 when success", async () => {
      const data = {
        name: "adriano",
        email: "adriano@email.com",
        password: "12345679"
      };
      const expected = {
        id: "UUID",
        name: "adriano",
        email: "adriano@email.com"
      };

      const response = await supertest.post("/register").send(data);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toEqual(expected);
    });

    it("should return status 400 when provider invalid values", async () => {
      const data = {
        name: "adriano",
        email: "adriano",
        password: "12345679"
      };
      const expected = [
        {
          validation: "email",
          code: "invalid_string",
          message: "Invalid email",
          path: ["email"]
        }
      ];

      const response = await supertest.post("/register").send(data);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(expected);
    });

    it("should return status 400 when email already exists", async () => {
      const data = {
        name: "adriano",
        email: "adriano@email.com",
        password: "12345679"
      };
      const expected = "Unique constraint failed on the Email already exists";

      database.users = [UserApplication.create(data)];
      const response = await supertest.post("/register").send(data);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(expected);
    });
  });
  describe("POST /user/login", () => {
    it("should return status 200 when success", async () => {
      const data = {
        email: "adriano@email.com",
        password: "12345679"
      };
      database.users = [
        UserApplication.create(Object.assign(data, { name: "adriano" }))
      ];

      const response = await supertest.post("/login").send(data);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.token).toBeDefined();
    });

    it("should return status 400 when invalida data", async () => {
      const data = {
        email: "adriano",
        password: "12345679"
      };
      const expected = [
        {
          code: "invalid_string",
          message: "Invalid email",
          path: ["email"],
          validation: "email"
        }
      ];

      const response = await supertest.post("/login").send(data);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(expected);
    });

    it("should return status 401 when user not found", async () => {
      const data = {
        email: "adriano@email.com",
        password: "12345679"
      };

      const response = await supertest.post("/login").send(data);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual("User Unauthorized");
    });

    it("should return status 401 when wrong password", async () => {
      const data = {
        email: "adriano@email.com",
        password: "12345679"
      };

      database.users = [
        UserApplication.create(
          Object.assign({}, data, {
            name: "adriano",
            password: "ontherpassword"
          })
        )
      ];
      const response = await supertest.post("/login").send(data);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toEqual("User Unauthorized");
    });
  });
});
