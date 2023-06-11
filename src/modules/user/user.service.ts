import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { BusinessException } from '@/common/exceptions/business.exception';
import { UtilService } from '../../shared/utils.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';
import { RoleService } from '../role/role.service';
import { GetUserListDto } from './dto/getUserList.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { Role } from '../role/entities/role.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from '../organization/entities/organization.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly utilService: UtilService,
    private readonly roleService: RoleService,
    private readonly orgService: OrganizationService,
  ) {}

  /**
   *
   * @returns
   * @description 查询queryBuilder封装
   */
  createSearchQb() {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'org')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user',
        'org.id',
        'org.org_name',
        'org.org_code',
        'role.id',
        'role.role_name',
        'role.role_code',
      ])
      .where({
        deleted: 0,
      });
    return queryBuilder;
  }
  /**
   *
   * @param params getUserListDto
   * @returns
   * @description 分页查找用户
   */
  async findList(params: GetUserListDto) {
    const { username, status, roles, org_code, page = 1, page_size = 10 } = params;
    const queryBuilder = this.createSearchQb();
    queryBuilder.andWhere({
      ...(username !== undefined ? { username: Like(`%${username}%`) } : null),
      ...(status !== undefined ? { status } : null),
    });
    if (org_code) {
      queryBuilder.andWhere('org.org_code = :org_code', { org_code });
    }
    if (roles?.length > 0) {
      queryBuilder.andWhere('role.role_code IN (:...roles)', { roles });
    }
    return await this.utilService.createPaginationResDto(queryBuilder, { page, page_size });
  }
  /**
   *
   * @param username string
   * @returns {User}
   * @description 根据用户名获取用户信息
   */
  async findOneByUsername(username: string) {
    return this.userRepository.findOne({ where: { username, deleted: 0 } });
  }
  /**
   *
   * @param id string
   * @returns {User}
   * @description 根据用户id获取用户信息
   */
  async findOneById(id: string) {
    const queryBuilder = this.createSearchQb();
    return queryBuilder.andWhere({ id }).getOne();
  }
  /**
   *
   * @param user
   * @returns {User}
   * @description 获取登录用户信息
   */
  async getUserInfo(user: User) {
    const roles = await this.roleService.findRolesByUserId(user.id);
    const org = await this.orgService.findOrgByUserId(user.id);
    user.roles = roles;
    user.organization = org;
    return user;
  }

  /**
   *
   * @param username
   * @returns {User | null}
   * @description 判断用户是否存在
   */
  async getExistingUserByUsername(username: string) {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('username=:username', { username })
      .andWhere('deleted=:deleted', { deleted: 0 })
      .getOne();
    if (existingUser) return existingUser;
    return null;
  }
  /**
   *
   * @param authDto AuthDto
   * @returns {User}
   * @description 用户注册
   */
  async register({ username, password = '123456' }: AuthDto) {
    const existingUser = await this.getExistingUserByUsername(username);
    if (existingUser) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10001);
    }
    // 默认普通用户
    const role = await this.roleService.getDefaultRole();
    // 默认根组织
    const organization = await this.orgService.getDefaultOrg();
    const user = await this.entityManager.transaction(async (manager) => {
      const hashPassword = await this.utilService.encrypt(password);
      const user = manager.create(User, {
        username,
        password: hashPassword,
        status: 1,
        roles: role ? [role] : [],
        organization, // 默认根组织
      });
      const newUser = await manager.save(user);
      return newUser;
    });
    return user;
  }
  /**
   *
   * @param createUserDto
   * @description 新增用户
   */
  async create(createUserDto: CreateUserDto) {
    const { username, password = '123456', roles: roleCodes, org_code, ...rest } = createUserDto;
    const existingUser = await this.getExistingUserByUsername(username);
    if (existingUser) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_10001);
    }
    this.entityManager.transaction(async (manager) => {
      const hashPassword = await this.utilService.encrypt(password);
      let roles: Role[] = [];
      let org: Organization;
      if (roleCodes.length > 0) {
        roles = await this.roleService.findAllByCodes(roleCodes);
      } else {
        // 默认普通用户
        const defaultRole = await this.roleService.getDefaultRole();
        defaultRole && roles.push(defaultRole);
      }
      if (org_code) {
        org = await this.orgService.getOrgByCode(org_code);
      } else {
        org = await this.orgService.getDefaultOrg();
      }
      const newUser = manager.create(User, {
        username,
        password: hashPassword,
        roles,
        organization: org,
        ...rest,
      });
      await manager.save(newUser);
    });
  }

  /**
   *
   * @param updateUserDto
   * @description 更新用户信息
   */
  async update(id: string, { roles: roleCodes, org_code, password, ...rest }: UpdateUserDto) {
    await this.entityManager.transaction(async (manager) => {
      if (password) {
        await this.utilService.encrypt(password);
      }
      await manager.update(User, id, {
        ...rest,
      });
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'role')
        .leftJoinAndSelect('user.organization', 'org')
        .where('user.id = :id', { id })
        .getOne();
      const roles = await this.roleService.findAllByCodes(roleCodes);
      const org = await this.orgService.getOrgByCode(org_code);
      // 多对多关系
      await manager
        .createQueryBuilder()
        .relation(User, 'roles')
        .of(id)
        .addAndRemove(roles, user?.roles);
      // 多对一关系
      await manager.createQueryBuilder().relation(User, 'organization').of(id).set(org);
    });
  }
  /**
   *
   * @param condition
   * @param ids
   * @returns
   * @description 批量更新
   */
  async batchUpdate(condition: QueryDeepPartialEntity<User>, ids: string[]) {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set(condition)
      .where('user.id IN (:...ids)', { ids })
      .execute();
  }
  /**
   *
   * @param ids
   * @returns
   * @description 批量删除
   */
  async batchDelete(ids: string[]) {
    this.batchUpdate({ deleted: 1 }, ids);
  }

  /**
   *
   * @param status
   * @param ids
   * @returns
   * @description 批量更新状态
   */
  async batchChangeStatus(status: number, ids: string[]) {
    this.batchUpdate(
      {
        status,
      },
      ids,
    );
  }
}
