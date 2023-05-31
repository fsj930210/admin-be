import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ErrorCodeType } from '../constants/errorCode';

export class BusinessException extends HttpException {
  /**
   * 业务错误码
   */
  private errorCode: ErrorCodeType;

  constructor(errorCode: ErrorCodeType) {
    super(ERROR_CODE[errorCode], HttpStatus.OK);
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCodeType {
    return this.errorCode;
  }
}
