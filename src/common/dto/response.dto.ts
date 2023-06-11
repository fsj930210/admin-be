import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SUCCESS_CODE } from '../constants';

export class BasicResponseDto<T> {
  readonly data: T | null;

  @ApiProperty({ description: 'code' })
  readonly code: string;

  @ApiProperty({ description: 'message' })
  readonly message: string;

  constructor(code: string, data: T = null, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data: any = null) {
    return new BasicResponseDto(SUCCESS_CODE, data);
  }
}

export class Pagination {
  @ApiProperty({ description: '总数' })
  total: number;

  @ApiProperty({ description: '当前页' })
  page: number;

  @ApiProperty({ description: '每页多少条' })
  page_size: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: '数据' })
  data: T[];

  @ApiProperty({ description: '分页信息' })
  paging: Pagination;
  constructor(data: T[], paging: Pagination) {
    this.data = data;
    this.paging = paging;
  }
}

export const ApiResponse = <DataDto extends Type<unknown>, WrapperDataDto extends Type<unknown>>(
  dataDto: DataDto,
  wrapperDataDto: WrapperDataDto,
) =>
  applyDecorators(
    ApiExtraModels(wrapperDataDto, dataDto),
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${dataDto.name}`,
        allOf: [
          { $ref: getSchemaPath(wrapperDataDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponseData = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  ApiResponse(dataDto, BasicResponseDto);

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto) =>
  ApiResponse(dataDto, PaginatedResponseDto);
