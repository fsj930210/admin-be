import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UtilService } from '@/shared/utils.service';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly utilservice: UtilService,
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  // 这个方法的返回值会给req
  async validate(username: string, password: string) {
    const user = await this.userService.getExistingUserByUsername(username);
    if (!user) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10002);
    }
    const isEqual = await this.utilservice.compare(password, user.password);
    if (!isEqual) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10003);
    }
    return user;
  }
}
