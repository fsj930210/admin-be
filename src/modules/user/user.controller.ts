/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('用户模块')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  findAll() {
    console.log(this.configService.get('name'));
    return this.configService.get('mysql').name;
  }
}
