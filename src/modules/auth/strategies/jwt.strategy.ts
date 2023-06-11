import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UserService } from '@/modules/user/user.service';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';

export type JwtPayload = {
  username: string;
  id: number;
  iat: string;
  exp: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    } as StrategyOptions);
  }
  async validate(payload: JwtPayload) {
    console.log(' JwtStrategy payload', payload);
    const existUser = await this.userService.getExistingUserByUsername(payload.username);
    if (!existUser) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10005, HttpStatus.UNAUTHORIZED);
    }
    return existUser;
  }
}
