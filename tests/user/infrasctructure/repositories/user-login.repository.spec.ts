import { diContainer } from "@/containers";
import "@/logger-config";

import "@/user/main/container";

import { Cache } from "@/cache/cache";
import { Logger } from "@/logger/logger";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { UnauthorizedError } from "@/protocols/either/errors/unauthorized.error";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { UserLoginProps } from "@/user/applications/user.props";
import { UserLoginRepository } from "@/user/applications/user.repository";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";

Logger.pause();

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("jwtToken")
}));

describe("UserLoginRepository", () => {
  const database = diContainer.get(UserDatabase) as UserMockedDatabase;
  let userLoginRepository: UserLoginRepository;

  beforeEach(() => {
    database.users = [];
    userLoginRepository = diContainer.get(UserLoginRepository);
    diContainer.get(Cache).clear();
  });
  describe("login", () => {
    it("should return JWT token when login is successful", async () => {
      // Arrange
      const props: UserLoginProps = {
        email: "test@example.com",
        password: "password123"
      };

      const user = {
        name: "test",
        email: "test@example.com",
        password: "password123",
        token: "jwtToken"
      };

      database.users = [UserApplication.create(user)];

      // Act
      const result = await userLoginRepository.login(props);

      // Assert
      expect(result.isRight()).toBe(true);
      expect(result.value).toBe(user.token);
    });

    it("should return UnauthorizedError when password is invalid", async () => {
      // Arrange
      const props: UserLoginProps = {
        email: "test@example.com",
        password: "wrongPassword"
      };

      const user = {
        name: "test",
        email: "test@example.com",
        password: "password123",
        token: "jwtToken"
      };

      database.users = [UserApplication.create(user)];

      // Act
      const result = await userLoginRepository.login(props);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UnauthorizedError);
      result.isLeft() &&
        expect(result.extract().message).toBe("Invalid password");
    });

    it("should return UnauthorizedError when user is not found", async () => {
      // Arrange
      const props: UserLoginProps = {
        email: "test@example.com",
        password: "password123"
      };

      database.users = [];

      // Act
      const result = await userLoginRepository.login(props);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(UnauthorizedError);
      result.isLeft() &&
        expect(result.extract().message).toBe("User not found");
    });

    it("should return InternalServerError when an error occurs", async () => {
      // Arrange
      const props: UserLoginProps = {
        email: "test@example.com",
        password: "password123"
      };

      database.findOne = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act
      const result = await userLoginRepository.login(props);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InternalServerError);
      result.isLeft() &&
        expect(result.extract().message).toBe("Database error");
    });
  });
});
