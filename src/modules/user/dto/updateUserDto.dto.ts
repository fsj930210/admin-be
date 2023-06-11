import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '密码' })
  @Min(6)
  @Max(100)
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  @IsOptional()
  status?: 0 | 1;

  @ApiProperty({ description: '组织id' })
  @IsString()
  @IsOptional()
  org_code?: string;

  @ApiProperty({ description: '角色' })
  @IsArray()
  @IsOptional()
  roles?: string[];

  @ApiProperty({ description: '备注' })
  @Max(255)
  @IsString()
  @IsOptional()
  remark?: string;
}
