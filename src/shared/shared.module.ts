import { Global, Module } from '@nestjs/common';
import { UtilService } from './utils.service';
import { LoggerModule } from './logger.module';

/**
 * 全局共享模块
 */
@Global()
@Module({
  imports: [LoggerModule],
  providers: [UtilService],
  exports: [UtilService],
})
export class SharedModule {}
