import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { SUCCESS_CODE } from '../constants/errorCode';

export class BasicResponseDto<T> {
  readonly data: T | null;

  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly message: string;

  constructor(code: string, data = null, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data = null) {
    return new BasicResponseDto(SUCCESS_CODE, data);
  }
}

export class Pagination {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  page_size: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty()
  paging: Pagination;
}

export const ApiResponse = <
  DataDto extends Type<unknown>,
  WrapperDataDto extends Type<unknown>,
>(
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

export const ApiOkResponseData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => ApiResponse(dataDto, BasicResponseDto);

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => ApiResponse(dataDto, PaginatedResponseDto);
