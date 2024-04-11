import { ZodSchema } from "zod";
import { Either, left, right } from "../either/either";

function validate(schema: ZodSchema<any>, data: any): Either<any, any> {
  const response = schema.safeParse(data);
  return response.success ? right(response.data) : left(response.error);
}

export function ValidateWith(schema: ZodSchema<any>) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: Either<any, any>[]): any {
      const [data] = args;
      const validationResult = validate(schema, data);
      return originalMethod.apply(this, [validationResult]);
    };

    return descriptor;
  };
}
