/**
 * 业务错误码
 */
export const ERROR_CODE = {
  // 通用异常
  '10000': '系统内部异常',
  // 用户相关
  '10001': '用户已存在',
  '10002': '用户不存在',
  '10003': '用户名密码不正确',
  // token 相关
  '10004': 'token不能为空',
  '10005': '无效的token',
} as const;

export const SUCCESS_CODE = '00000';

export type ErrorCodeType = keyof typeof ERROR_CODE;
