import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UtilService } from '../../shared/utils.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async findOneWithPassword(username: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .andWhere('user.deleted=:deleted', { deleted: '0' })
      .getOne();
  }
  async findOne(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }
  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const existedUser = await this.findOne(username);
    if (existedUser) {
      throw new BusinessException('10001');
    }
    const hashedPassword = await this.utilService.encrypt(password);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }
}
