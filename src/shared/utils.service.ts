import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';
import { Entity, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { IPaginationParams } from '@/common/interface';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../common/constants/index';
import { PaginatedResponseDto } from '@/common/dto/response.dto';

@Injectable()
export class UtilService {
  async encrypt(value: string) {
    try {
      const hash = await bcryptHash(value, 10);
      return hash;
    } catch (error) {
      console.log(error);
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10000);
    }
  }
  async compare(value: string, dbValue: string) {
    try {
      const hash = await bcryptCompare(value, dbValue);
      return hash;
    } catch (error) {
      console.log(error);
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10000);
    }
  }
  async createPaginationResDto<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationParams,
  ) {
    const { page = DEFAULT_PAGE, page_size = DEFAULT_PAGE_SIZE } = options;
    queryBuilder.take(page_size).skip((page - 1) * page_size);
    const [items, total] = await queryBuilder.getManyAndCount();
    return new PaginatedResponseDto(items, { total, page, page_size });
  }
}
