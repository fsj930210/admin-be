/**
 * 业务错误码
 */
export enum ERROR_CODE_ENUM {
  // 通用异常
  ERROR_CODE_10000 = '系统内部异常',

  // 用户相关
  ERROR_CODE_10001 = '用户已存在',
  ERROR_CODE_10002 = '用户不存在',
  ERROR_CODE_10003 = '用户名密码不正确',

  // token 相关
  ERROR_CODE_10004 = 'token不能为空',
  ERROR_CODE_10005 = '无效的token',
}
