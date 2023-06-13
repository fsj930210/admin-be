import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from '@/common/enum/role.enum';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';
import { UtilService } from '../../shared/utils.service';
import { FindRoleDto } from './dto/find-role.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly utilService: UtilService,
  ) {}
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
      where: { role_code, deleted: 0 },
    });
    return role;
  }
  /**
   *
   * @param id
   * @returns
   * @description 根据id获取角色
   */
  async findById(id: number) {
    const role = await this.roleRepository.findOne({
      select: this.getSelect(),
      where: { id, deleted: 0 },
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
  /**
   *
   * @param param0
   * @returns
   * @description 分页查询
   */
  async findList({ page, page_size, role_name }: FindRoleDto) {
    console.log('role_name==', role_name);

    const queryBuilder = this.roleRepository.createQueryBuilder('role').where({
      ...(role_name !== undefined ? { role_name: Like(`%${role_name}%`) } : null),
      deleted: 0,
    });
    return await this.utilService.createPaginationResDto(queryBuilder, { page, page_size });
  }
  /**
   *
   * @param param0
   * @returns
   * @description 创建角色
   */
  async create({ role_code, ...rest }: CreateRoleDto) {
    let code = role_code;
    if (role_code) {
      const existingRole = await this.getExistingRole(role_code);
      if (existingRole) {
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_30000);
      }
    } else {
      code = await this.utilService.generateUUID();
    }
    const role = this.roleRepository.create({
      role_code: code,
      ...rest,
    });
    return await this.roleRepository.save(role);
  }
  /**
   *
   * @param id
   * @param param1
   * @returns
   * @description 更新角色信息
   */
  async update(id: number, { role_name, user_ids, menu_ids }: UpdateRoleDto) {
    if (role_name) {
      await this.roleRepository.update(id, {
        role_name,
      });
    }
    await this.entityManager.transaction(async (manager) => {
      const role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.users', 'user')
        .leftJoinAndSelect('role.menus', 'menu')
        .where('role.id = :id', { id })
        .getOne();
      if (user_ids?.length > 0) {
        const users = await this.userRepository.find({
          where: {
            id: In(user_ids),
          },
        });
        await manager
          .createQueryBuilder()
          .relation(Role, 'users')
          .of(id)
          .addAndRemove(users, role?.users);
      }
      if (menu_ids?.length > 0) {
        // const users = this.userRepository.find({ where: {
        //   id: In(user_ids)
        // }});
        // await manager
        //   .createQueryBuilder()
        //   .relation(Role, 'users')
        //   .of(id)
        //   .addAndRemove(users, role?.users);
      }
    });
  }
  async batchUpdate(condition: QueryDeepPartialEntity<Role>, ids: number[]) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .update(Role)
      .set(condition)
      .where('role.id IN (:...ids)', { ids })
      .execute();
  }
  /**
   *
   * @param ids
   * @returns
   * @description 批量删除
   */
  async batchDelete(ids: number[]) {
    this.batchUpdate({ deleted: 1 }, ids);
  }

  /**
   *
   * @param status
   * @param ids
   * @returns
   * @description 批量更新状态
   */
  async batchChangeStatus(status: number, ids: number[]) {
    this.batchUpdate(
      {
        status,
      },
      ids,
    );
  }
  async getExistingRole(role_code: string) {
    const existingRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('role_code=:role_code', { role_code })
      .andWhere('deleted=:deleted', { deleted: 0 })
      .getOne();
    if (existingRole) return existingRole;
    return null;
  }
}
