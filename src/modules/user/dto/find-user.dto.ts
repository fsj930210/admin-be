import { PaginationRequestDto } from '@/common/dto/request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class GetUserListDto extends PaginationRequestDto {
  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsIn([0, 1])
  status?: number;

  @ApiProperty({ description: '角色' })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiProperty({ description: '' })
  @IsOptional()
  @IsString()
  org_code?: string;
}
