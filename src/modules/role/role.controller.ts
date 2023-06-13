import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangeRoleStatus } from './dto/change-roleStatus.dto';
import { FindRoleDto } from './dto/find-role.dto';

@ApiTags('角色模块')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '创建角色' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: '获取角色列表' })
  @Get('list')
  findList(@Query() findRoleDto: FindRoleDto) {
    return this.roleService.findList(findRoleDto);
  }

  @ApiOperation({ summary: '获取角色信息' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findById(+id);
  }

  @ApiOperation({ summary: '批量更新状态' })
  @ApiBearerAuth()
  @Put('status')
  async batchChangeStatus(@Body() { status, ids }: ChangeRoleStatus) {
    return await this.roleService.batchChangeStatus(status, ids);
  }
  @ApiOperation({ summary: '更新角色信息' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @ApiOperation({ summary: '批量删除角色信息' })
  @Delete()
  batchDelete(@Body('ids') ids: number[]) {
    return this.roleService.batchDelete(ids);
  }

  @ApiOperation({ summary: '删除角色信息' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.batchDelete([+id]);
  }
}
