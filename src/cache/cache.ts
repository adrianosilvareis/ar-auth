import { injectable } from "inversify";

@injectable()
export class Cache<K, V> {
  private cache: Map<K, { value: V; expiresAt: number }> = new Map();

  private defaultExpiration: number = 60;

  set(key: K, value: V, expiration: number = this.defaultExpiration): void {
    const expiresAt = Date.now() + expiration * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: K): V | undefined {
    const cacheItem = this.cache.get(key);
    if (cacheItem && cacheItem.expiresAt > Date.now()) {
      return cacheItem.value;
    }
    this.cache.delete(key);
    return undefined;
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
