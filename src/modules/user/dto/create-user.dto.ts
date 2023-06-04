import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @Length(4, 32, { message: `用户名长度必须在$constraint1到$constraint2之间` })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @ApiProperty({ description: '密码' })
  @IsString()
  @Length(6, 32, { message: `密码长度必须在$constraint1到$constraint2之间` })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
