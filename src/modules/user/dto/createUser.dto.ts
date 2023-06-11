import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  username: string;
  @ApiProperty({ description: '密码' })
  @IsString()
  @IsOptional()
  @Length(6, 64)
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
  @ApiProperty({ description: '备注' })
  @Length(0, 255)
  @IsString()
  @IsOptional()
  remark?: string;
}
