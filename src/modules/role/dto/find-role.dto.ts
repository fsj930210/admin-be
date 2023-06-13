import { PaginationRequestDto } from '@/common/dto/request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindRoleDto extends PaginationRequestDto {
  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @IsString()
  role_name?: string;

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number;
}
