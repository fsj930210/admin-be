import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @Min(4)
  @Max(50)
  username: string;
  @ApiProperty({ description: '密码' })
  @IsString()
  @IsOptional()
  @Min(6)
  @Max(100)
  password?: string;
  @ApiProperty({ description: '用户状态' })
  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  status?: number;
  @ApiProperty({ description: '组织id' })
  @IsString()
  @IsOptional()
  org_code?: string;
  @ApiProperty({ description: '角色' })
  @IsArray()
  @IsOptional()
  roles?: string[];
}
