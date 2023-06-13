import { IsOptional, IsString, Length } from 'class-validator';
import { PaginationRequestDto } from '@/common/dto/request.dto';

export class FindOrganizationDto extends PaginationRequestDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  org_name?: string;
}
