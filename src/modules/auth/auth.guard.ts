import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from '@/common/exceptions/business.exception';
import { AUTHORIZE_KEY_METADATA } from '@/common/constants';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService, private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorized = this.reflector.getAllAndOverride<boolean>(AUTHORIZE_KEY_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 授权的直接跳过
    if (authorized) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new BusinessException('10004', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await verify(token, this.configService.get('jwt.secret') as string);
      console.log('guard payload', payload);
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new BusinessException('10005', HttpStatus.UNAUTHORIZED);
    }
    const parentCanActivate = (await super.canActivate(context)) as boolean; // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
    // custom logic goes here too
    return parentCanActivate;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
