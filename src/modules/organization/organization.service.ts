import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Like, Repository, TreeRepository } from 'typeorm';
import { DEFAULT_ORG_CODE } from '@/common/constants';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ERROR_CODE_ENUM } from '@/common/enum/errorCode.enum';
import { UtilService } from '@/shared/utils.service';
import { FindOrganizationDto } from './dto/find-organization.dto';
import { MoveOrganizationDto } from './dto/move-organization.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepository: TreeRepository<Organization>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}
  /*
   * @returns
   * @description 返回指定字段
   */
  getSelect(): (keyof Organization)[] {
    return ['id', 'org_name', 'org_code', 'path'];
  }
  /**
   *
   * @returns
   * @description 获取默认组织
   */
  async findDefaultOrg() {
    return this.findOrgByCode(DEFAULT_ORG_CODE);
  }
  /**
   *
   * @param orgCode
   * @returns
   * @description 根据组织编码获取组织
   */
  async findOrgByCode(orgCode: string) {
    return await this.orgRepository.findOne({
      select: this.getSelect(),
      where: {
        org_code: orgCode,
        deleted: 0,
      },
    });
  }
  /**
   *
   * @param orgCode
   * @returns
   * @description 根据组织编码获取组织
   */
  async findOrgById(id: number) {
    return await this.orgRepository.findOne({
      select: this.getSelect(),
      where: {
        id,
        deleted: 0,
      },
    });
  }
  /**
   *
   * @param id
   * @returns
   * @description 根据用户id获取组织
   */
  async findOrgByUserId(id: number) {
    const org = await this.orgRepository.findOne({
      select: this.getSelect(),
      where: {
        users: { id },
        deleted: 0,
      },
    });
    return org;
  }
  /**
   * @description 创建组织
   * @author fengshaojian
   * @param {CreateOrganizationDto} { org_code, ...rest }
   * @returns
   * @memberof OrganizationService
   */
  async create({ org_code, parent_id, ...rest }: CreateOrganizationDto) {
    if (parent_id === 0) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20001);
    }
    let code = org_code;
    if (org_code) {
      const existingOrg = await this.getExistingOrgByOrgCode(org_code);
      if (existingOrg) {
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20000);
      }
    } else {
      code = await this.utilService.generateUUID();
    }
    const parentOrg = await this.findOrgById(parent_id);
    const path = `${parentOrg.path}/${code}`;
    const org = this.orgRepository.create({ ...rest, org_code: code, path, parent: parentOrg });
    return await this.orgRepository.save(org);
  }
  /**
   *
   * @returns
   * @description 查询组织列表-列表形式
   */
  async findList({ org_name, page, page_size }: FindOrganizationDto) {
    const queryBuilder = this.orgRepository
      .createQueryBuilder('org')
      .where({
        ...(org_name !== undefined ? { org_name: Like(`%${org_name}%`) } : null),
        deleted: 0,
      })
      .orderBy({
        order_no: 'DESC',
      });
    return await this.utilService.createPaginationResDto(queryBuilder, { page, page_size });
  }
  /**
   * @description 获取组织树-全量 树形结构
   */
  async findTree(org_name: string) {
    if (org_name) {
      const orgTree: Organization[] = [];
      const orgList = await this.orgRepository
        .createQueryBuilder('org')
        .where('org.org_name like :org_name', { org_name: `%${org_name}%` })
        .getMany();

      for (const org of orgList) {
        const child = await this.orgRepository.findDescendantsTree(org);
        orgTree.push(child);
      }
      return orgTree;
    }

    const orgTree = await this.orgRepository.findTrees();

    return orgTree;
  }
  /**
   *
   * @param org_id
   * @returns
   * @description 懒加载树
   */
  async findTreeLazyload(org_id: number) {
    if (!org_id) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20006);
    }
    const currentOrg = await this.findOrgById(org_id);
    return this.orgRepository.find({ where: { parent: currentOrg } });
  }
  /**
   *
   * @param org_id
   * @returns
   * @description 根据org_id反向查找祖先树
   */
  async findAncestorsTree(org_id: number) {
    if (!org_id) {
      throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20006);
    }
    const currentOrg = await this.findOrgById(org_id);
    const list = await this.orgRepository.findAncestors(currentOrg, { relations: ['parent'] });
    return this.utilService.findAncestorsTree(list);
  }
  /**
   *
   * @param id
   * @param param1
   * @description 更新组织
   */
  async update(id: number, { org_name }: UpdateOrganizationDto) {
    await this.orgRepository.update(
      {
        id,
      },
      {
        org_name,
      },
    );
  }
  /**
   *
   * @param id
   * @description 删除组织
   */
  async delete(id: number) {
    const org = await this.findOrgById(id);
    if (org) {
      if (org.org_code === DEFAULT_ORG_CODE) {
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20002);
      }
      const childCount = await this.orgRepository.countDescendants(org);
      if (childCount > 0) {
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20003);
      }
      const userCount = await this.userRepository.countBy({
        organization: { org_code: org.org_code },
      });
      if (userCount > 0) {
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20004);
      }
      await this.orgRepository
        .createQueryBuilder('org')
        .update(Organization)
        .set({ deleted: 1 })
        .where({ id })
        .execute();
    } else {
      // todo 如果该节点已被删除提示？因为是软删除，其实就是更新状态
    }
  }
  /**
   *
   * @param moveDto
   * @description 移动
   */
  async move(moveDto: MoveOrganizationDto) {
    //
  }
  /**
   *
   * @param username
   * @returns {User | null}
   * @description 判断组织是否存在
   */
  async getExistingOrgByOrgCode(org_code: string) {
    const existingOrg = await this.orgRepository
      .createQueryBuilder('org')
      .where('org_code=:org_code', { org_code })
      .andWhere('deleted=:deleted', { deleted: 0 })
      .getOne();
    if (existingOrg) return existingOrg;
    return null;
  }
}
