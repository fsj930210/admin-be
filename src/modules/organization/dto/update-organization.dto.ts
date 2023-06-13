import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  org_name: string;
  @IsNumber()
  @IsOptional()
  order?: number = 0;
}
