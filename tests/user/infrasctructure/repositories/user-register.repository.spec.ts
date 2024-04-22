import { diContainer } from "@/containers";
import "@/user/main/container";

import { Cache } from "@/cache/cache";
import { InternalServerError } from "@/protocols/either/errors/internal-server.error";
import { UserApplication } from "@/user/applications/user.application";
import { UserDatabase } from "@/user/applications/user.database";
import { UserProps } from "@/user/applications/user.props";
import { UserRegisterRepository } from "@/user/applications/user.repository";
import { UserMockedDatabase } from "@/user/infrastructure/gateways/databases/users-mocked.database";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("mockedId")
}));

describe("UserRegisterRepository", () => {
  const database = diContainer.get(UserDatabase) as UserMockedDatabase;
  let userRegisterRepository: UserRegisterRepository;

  beforeEach(() => {
    database.users = [];
    userRegisterRepository = diContainer.get(UserRegisterRepository);
    diContainer.get(Cache).clear();
  });

  describe("register", () => {
    it("should register a new user and return the user's miss info", async () => {
      // Arrange
      const props: UserProps = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      // Act
      const result = await userRegisterRepository.register(props);

      // Assert
      expect(result.isRight()).toBe(true);
      expect(result.extract()).toEqual({
        id: "mockedId",
        name: "John Doe",
        email: "john@example.com"
      });
      expect(database.users.length).toBe(1);
      expect(database.users[0]).toEqual(
        UserApplication.create({
          name: "John Doe",
          email: "john@example.com",
          password: expect.any(String)
        })
      );
    });

    it("should return an InternalServerError if an error occurs during registration", async () => {
      // Arrange
      const props: UserProps = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };

      const errorMessage = "Database error";
      database.add = jest
        .fn()
        .mockRejectedValue(new InternalServerError(errorMessage));

      // Act
      const result = await userRegisterRepository.register(props);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(result.extract()).toBeInstanceOf(InternalServerError);
      result.isLeft() && expect(result.extract().message).toBe(errorMessage);
      expect(database.users.length).toBe(0);
    });
  });
});
