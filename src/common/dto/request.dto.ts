import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

export class PaginationRequestDto {
  @ApiProperty({ description: '当前页' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiProperty({ description: '当前页条数' })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(10)
  page_size?: number = DEFAULT_PAGE_SIZE;
}
