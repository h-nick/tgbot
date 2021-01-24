import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

/*
  Service writes, read and delete data from Redis cache.
*/

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async get<T>(key: string): Promise<T> {
    const value = await this.cache.get<T>(key);
    return value;
  }

  async set(key: string, value): Promise<void> {
    await this.cache.set(key, value);
  }
}