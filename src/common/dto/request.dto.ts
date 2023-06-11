import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty({ description: '当前页' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({ description: '当前页条数' })
  @IsOptional()
  @IsNumber()
  @Min(10)
  page_size: number;
}
