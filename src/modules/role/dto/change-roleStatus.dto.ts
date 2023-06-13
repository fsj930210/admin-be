import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty } from 'class-validator';

export class ChangeRoleStatus {
  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  @IsNotEmpty()
  status: 0 | 1;

  @ApiProperty({ description: '角色id' })
  @IsArray()
  @IsNotEmpty()
  ids: number[];
}
