export class SensitiveFilter {
  private sensitiveKeys: string[];
  private placeholder!: string;

  constructor(sensitiveKeys: string[]) {
    this.sensitiveKeys = sensitiveKeys;
    this.placeholder = "*sensitive*";
  }

  public filterSensitiveKeys(data: Record<string, any>): Record<string, any> {
    if (Array.isArray(data)) {
      // If the data is an array, map over it and recursively sanitize each item
      return data.map((item) => this.filterSensitiveKeys(item));
    }

    const sanitizedData: Record<string, any> = { ...data };

    for (const key of Object.keys(data)) {
      if (typeof data[key] === "object" && data[key] !== null) {
        // If the value is an object, recursively sanitize its keys
        sanitizedData[key] = this.filterSensitiveKeys(data[key]);
      } else if (this.isSensitiveKey(key)) {
        // If the key is sensitive, replace its value
        sanitizedData[key] = this.setPlaceholder(data[key]);
      }
    }

    return sanitizedData;
  }

  private setPlaceholder(value: any): string {
    if (typeof value !== "string") {
      return this.placeholder;
    }
    if (value.length < 8) {
      return this.placeholder;
    }
    return `${value.slice(0, 2)}${this.placeholder}${value.slice(-2)}`;
  }

  private isSensitiveKey(key: string): boolean {
    return this.sensitiveKeys.includes(key);
  }
}
