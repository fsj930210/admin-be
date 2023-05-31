import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { BusinessException } from '@/common/exceptions/business.exception';

@Injectable()
export class UtilService {
  public async encrypt(value: string) {
    try {
      const hash = await bcrypt.hash(value, 10);
      return hash;
    } catch (error) {
      throw new BusinessException('10000');
    }
  }
  public async decrypt(value: string, dbValue: string) {
    try {
      const hash = await bcrypt.compare(value, dbValue);
      return hash;
    } catch (error) {
      throw new BusinessException('10000');
    }
  }
}
