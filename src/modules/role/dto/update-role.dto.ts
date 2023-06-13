import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  role_name?: string;
  @IsArray()
  @IsOptional()
  user_ids?: number[];
  @IsArray()
  @IsOptional()
  menu_ids?: number[];
}
