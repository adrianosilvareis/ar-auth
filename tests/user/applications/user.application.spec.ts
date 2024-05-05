import { diContainer } from "@/containers";
import { UserApplication } from "@/user/applications/user.application";
import { UserToken } from "@/user/applications/user.token";
import { User } from "@/user/domain/user";
import { RegisterResponsePresentation } from "@/user/infrastructure/presenters/register-response.presentation";
import { MockUserToken } from "@/user/infrastructure/services/user-token/mock-user.token";

describe("UserApplication", () => {
  const userProps: User = new User(
    "John Doe",
    "john@example.com",
    "password123"
  );

  it("should create a new UserApplication instance", () => {
    const user = UserApplication.create(userProps);

    expect(user).toBeInstanceOf(UserApplication);
    expect(user.name).toBe(userProps.name);
    expect(user.email).toBe(userProps.email);
    expect(user.password).toBe(userProps.password);
  });

  it("should generate a JWT token", () => {
    const user = UserApplication.create(userProps);
    diContainer.bind(UserToken).to(MockUserToken);
    const token = user.genToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should return user's missing information", () => {
    const user = UserApplication.create(userProps);
    const response = RegisterResponsePresentation.parse(user);

    expect(response).toEqual({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});
