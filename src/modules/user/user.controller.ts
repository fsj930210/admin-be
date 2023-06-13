import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { GetUserListDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangeUserStatus } from './dto/change-userStatus.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户模块')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取登录用户信息' })
  @ApiBearerAuth()
  @Get('info')
  async getUserInfo(@Req() req: { user: User }) {
    return await this.userService.getUserInfo(req.user);
  }

  @ApiOperation({ summary: '根据用户id获取用户信息' })
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @ApiOperation({ summary: '分页查询用户列表' })
  @ApiBearerAuth()
  @Post('list')
  async findList(@Body() params: GetUserListDto) {
    return await this.userService.findList(params);
  }

  @ApiOperation({ summary: '创建用户' })
  @ApiBearerAuth()
  @Post()
  async create(@Body() params: CreateUserDto) {
    return await this.userService.create(params);
  }

  @ApiOperation({ summary: '批量更新状态' })
  @ApiBearerAuth()
  @Put('status')
  async batchChangeStatus(@Body() { status, ids }: ChangeUserStatus) {
    return await this.userService.batchChangeStatus(status, ids);
  }
  @ApiOperation({ summary: '更新用户信息' })
  @ApiBearerAuth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '批量删除用户' })
  @ApiBearerAuth()
  @Delete()
  async batchDelete(@Body('ids') ids: string[]) {
    return await this.userService.batchDelete(ids);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.batchDelete([id]);
  }
}
