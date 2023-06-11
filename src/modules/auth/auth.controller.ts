import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { Authorize } from './decorators/authorize.decorator';
import { UserService } from '../user/user.service';

@ApiTags('认证模块')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @ApiOperation({ summary: '登录' })
  @Authorize()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginDto: AuthDto, @Req() req: { user: User }) {
    return this.authService.login(req.user);
  }
  @ApiOperation({ summary: '注册' })
  @Authorize()
  @Post('register')
  async register(@Body() createUserDto: AuthDto) {
    const user = this.userService.register(createUserDto);
    return user;
  }
}
