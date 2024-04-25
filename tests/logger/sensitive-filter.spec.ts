import { SensitiveFilter } from "@/logger/sensitive-filter";

describe("SensitiveFilter", () => {
  let sensitiveFilter: SensitiveFilter;

  beforeEach(() => {
    const sensitiveKeys = ["email", "password", "creditCardNumber"];
    sensitiveFilter = new SensitiveFilter(sensitiveKeys);
  });

  it("should filter sensitive keys in an object", () => {
    const input = {
      username: "john.doe",
      password: "secretpassword",
      creditCardNumber: "1234567890123456"
    };

    const expectedOutput = {
      username: "john.doe",
      password: "se*sensitive*rd",
      creditCardNumber: "12*sensitive*56"
    };

    const filteredObject = sensitiveFilter.filterSensitiveKeys(input);
    expect(filteredObject).toEqual(expectedOutput);
  });

  it("should not modify the original object when filtering sensitive keys", () => {
    const input = {
      username: "john.doe",
      password: "secretpassword",
      creditCardNumber: "1234567890123456"
    };

    const filteredObject = sensitiveFilter.filterSensitiveKeys(input);
    expect(filteredObject).not.toBe(input);
  });

  it("should filter sensitive keys in a nested object", () => {
    const input = {
      request: {
        value: {
          email: "adriano1@email.com",
          password: "123456789"
        }
      }
    };

    const expectedOutput = {
      request: {
        value: {
          email: "ad*sensitive*om",
          password: "12*sensitive*89"
        }
      }
    };

    const filteredObject = sensitiveFilter.filterSensitiveKeys(input);
    expect(filteredObject).toEqual(expectedOutput);
  });

  it("should filter sensitive keys in an array of objects", () => {
    const input = [
      {
        name: "John Doe",
        email: "email@email.com",
        password: "123456789",
        creditCardNumber: "1234567890123456"
      }
    ];

    const expectedOutput = [
      {
        name: "John Doe",
        email: "em*sensitive*om",
        password: "12*sensitive*89",
        creditCardNumber: "12*sensitive*56"
      }
    ];

    const filteredObject = sensitiveFilter.filterSensitiveKeys(input);
    expect(filteredObject).toEqual(expectedOutput);
  });

  it("should filter sensitive keys in objects nested in an array", () => {
    const input = [
      {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "123456789",
        creditCards: [
          {
            creditCardNumber: "1234567890123456",
            cvv: "123"
          },
          {
            creditCardNumber: "1234567890123456",
            cvv: "123"
          }
        ]
      }
    ];

    const expectedOutput = [
      {
        name: "John Doe",
        email: "jo*sensitive*om",
        password: "12*sensitive*89",
        creditCards: [
          {
            creditCardNumber: "12*sensitive*56",
            cvv: "123"
          },
          {
            creditCardNumber: "12*sensitive*56",
            cvv: "123"
          }
        ]
      }
    ];

    const filteredObject = sensitiveFilter.filterSensitiveKeys(input);
    expect(filteredObject).toEqual(expectedOutput);
  });
});
