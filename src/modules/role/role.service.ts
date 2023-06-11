import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from '@/common/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}
  /**
   *
   * @returns
   * @description 返回指定字段
   */
  getSelect(): (keyof Role)[] {
    return ['id', 'role_name', 'role_code'];
  }
  /**
   *
   * @returns
   * @description 获取默认角色
   */
  async getDefaultRole() {
    return await this.findByCode(ROLE_ENUM.ordinary);
  }
  /**
   *
   * @param codes
   * @returns
   * @description 根据codes获取多个角色
   */
  async findAllByCodes(codes: string[]) {
    const roles = await this.roleRepository.find({
      select: this.getSelect(),
      where: { role_code: In<string>(codes) },
    });
    return roles;
  }
  /**
   *
   * @param role_code
   * @returns
   * @description 根据code获取角色
   */
  async findByCode(role_code: string) {
    const role = await this.roleRepository.findOne({
      select: this.getSelect(),
      where: { role_code },
    });
    return role;
  }
  /**
   *
   * @param id
   * @returns
   * @description 根据用户id获取角色
   */
  async findRolesByUserId(id: number) {
    const roles = await this.roleRepository.find({
      select: this.getSelect(),
      where: {
        users: { id },
      },
    });
    return roles;
  }

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
