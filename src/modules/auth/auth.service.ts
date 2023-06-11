import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { TOKEN_KEY } from '@/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    @InjectRedis() private readonly redis: Redis,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const { username, id } = user;
    const roles = await this.roleService.findRolesByUserId(user.id);
    const token = await this.jwtService.signAsync({
      username,
      id,
      roles: roles.map((i) => i.role_code),
    });
    this.redis.set(`${TOKEN_KEY}:${user.id}`, token);
    return { access_token: token };
  }
}
