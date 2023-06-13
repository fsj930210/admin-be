import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  role_name: string;
  @IsString()
  @IsOptional()
  role_code?: string;
  @IsIn([0, 1])
  status?: number = 1;
}
