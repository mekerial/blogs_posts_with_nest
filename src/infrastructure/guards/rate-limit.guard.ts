import { Inject, Injectable } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  constructor(
    protected options,
    @Inject(Reflector) protected override reflector: Reflector,
    @Inject(ThrottlerStorage) protected storage: ThrottlerStorage,
  ) {
    super(options, storage, reflector);
  }
  protected override throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(this.errorMessage);
  }
}
