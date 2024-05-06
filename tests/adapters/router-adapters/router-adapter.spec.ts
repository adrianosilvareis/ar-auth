import { routerAdapter } from "@/adapters/router-adapter";
import { Controller } from "@/protocols/http/controllers";
describe("routerAdapter", () => {
  it("should call the controller's handler with the correct body and return the response", async () => {
    const req = {
      body: { key1: "value1", key2: "value2" },
      query: { key3: "value3" },
      params: { key4: "value4" },
      headers: { key5: "value5" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockHandlerResponse = {
      status: 200,
      body: { result: "success" }
    };
    const mockController: Controller<any, any> = {
      handler: jest.fn().mockResolvedValue(mockHandlerResponse)
    };

    const adapter = routerAdapter(mockController);
    await adapter(req as any, res as any);

    expect(mockController.handler).toHaveBeenCalledWith({
      key1: "value1",
      key2: "value2",
      key3: "value3",
      key4: "value4",
      headers: { key5: "value5" }
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ result: "success" });
  });
});
