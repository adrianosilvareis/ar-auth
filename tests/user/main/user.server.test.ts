import { app } from "@/express.config";
import { appUser } from "@/user/main/user.server";
import { StatusCodes } from "http-status-codes";
import request from "supertest";

appUser(app);
const supertest = request(app);

jest.mock("uuid", () => ({
  v4: jest.fn(() => "UUID")
}));

describe("User Server", () => {
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
});
