import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UserService } from '@/modules/user/user.service';

export type JwtPayload = {
  username: string;
  id: number;
  iat: string;
  exp: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    } as StrategyOptions);
  }
  async validate(payload: JwtPayload) {
    console.log(' JwtStrategy payload', payload);
    const existUser = await this.userService.findById(String(payload.id));
    if (!existUser) {
      throw new BusinessException('10005', HttpStatus.UNAUTHORIZED);
    }
    return existUser;
  }
}
