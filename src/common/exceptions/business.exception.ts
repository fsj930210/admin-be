import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ErrorCodeType } from '../constants/errorCode';

export class BusinessException extends HttpException {
  /**
   * 业务错误码
   */
  private errorCode: ErrorCodeType;

  constructor(errorCode: ErrorCodeType, status = HttpStatus.OK) {
    super(ERROR_CODE[errorCode], status);
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCodeType {
    return this.errorCode;
  }
}
