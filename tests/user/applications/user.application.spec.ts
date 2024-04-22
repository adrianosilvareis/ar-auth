import { diContainer } from "@/containers";
import { UserApplication } from "@/user/applications/user.application";
import { UserProps } from "@/user/applications/user.props";
import { UserToken } from "@/user/applications/user.token";
import { MockUserToken } from "@/user/infrastructure/services/user-token/mock-user.token";

describe("UserApplication", () => {
  const userProps: UserProps = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  };

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
    const missInfo = user.getMissInfo();

    expect(missInfo).toEqual({
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});
