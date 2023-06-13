import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty } from 'class-validator';

export class ChangeUserStatus {
  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  @IsNotEmpty()
  status: 0 | 1;

  @ApiProperty({ description: '用户id' })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
