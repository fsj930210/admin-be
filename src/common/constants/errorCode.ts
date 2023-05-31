/**
 * 业务错误码
 */
export const ERROR_CODE = {
  '10000': '系统内部异常',
};

export const SUCCESS_CODE = '00000';

export type ErrorCodeType = keyof typeof ERROR_CODE;
