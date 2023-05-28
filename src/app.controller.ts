import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessException } from './exceptions/business.exception';
import { ERROR_CODE } from './constants/errorCode';

@Controller({
  path: 'user',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const a: any = {};
    try {
      console.log(a.b.c);
    } catch (error) {
      throw new BusinessException({
        code: ERROR_CODE.TOKEN_INVALID,
        message: '错误',
      });
    }
    return this.appService.getHello();
  }
}
