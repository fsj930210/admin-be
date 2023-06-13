import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Put,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindOrganizationDto } from './dto/find-organization.dto';
import { MoveOrganizationDto } from './dto/move-organization.dto';

@ApiTags('组织模块')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: '创建组织' })
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: '分页获取组织列表' })
  @Get('list')
  findList(@Query() findOrganizationDto: FindOrganizationDto) {
    return this.organizationService.findList(findOrganizationDto);
  }

  @ApiOperation({ summary: '全量获取组织树' })
  @Get('tree')
  findTree(@Query('org_name') org_name: string) {
    return this.organizationService.findTree(org_name);
  }

  @ApiOperation({ summary: '懒加载获取组织树' })
  @Get('tree/lazy')
  findTreeLazyload(@Query('org_id') org_id: string) {
    return this.organizationService.findTreeLazyload(+org_id);
  }
  @ApiOperation({ summary: '获取祖先树' })
  @Get('tree/ancestor')
  findAncestorsTree(@Query('org_id') org_id: string) {
    return this.organizationService.findAncestorsTree(+org_id);
  }

  @ApiOperation({ summary: '根据id查询组织' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOrgById(+id);
  }

  @ApiOperation({ summary: '移动' })
  @Put()
  move(@Body() moveDto: MoveOrganizationDto) {
    return this.organizationService.move(moveDto);
  }
  @ApiOperation({ summary: '更新组织' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @ApiOperation({ summary: '删除组织' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.organizationService.delete(+id);
  }
}
