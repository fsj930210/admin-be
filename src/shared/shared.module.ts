import { Global, Module } from '@nestjs/common';
import { UtilService } from './utils.service';

// common provider list
const providers = [UtilService];

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [],
  providers: [...providers],
  exports: [...providers],
})
export class SharedModule {}
