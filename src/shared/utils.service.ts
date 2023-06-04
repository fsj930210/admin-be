import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { BusinessException } from '@/common/exceptions/business.exception';

@Injectable()
export class UtilService {
  public async encrypt(value: string) {
    try {
      const hash = await bcryptHash(value, 10);
      return hash;
    } catch (error) {
      console.log(error);
      throw new BusinessException('10000');
    }
  }
  public async compare(value: string, dbValue: string) {
    try {
      const hash = await bcryptCompare(value, dbValue);
      return hash;
    } catch (error) {
      console.log(error);
      throw new BusinessException('10000');
    }
  }
}
