import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { DEFAULT_ORG_CODE } from '@/common/constants';
import { BusinessException } from "@/common/exceptions/business.exception";
import { ERROR_CODE_ENUM } from "@/common/enum/errorCode.enum";
import { UtilService } from "@/shared/utils.service";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepository: Repository<Organization>,
    private utilService: UtilService
  ) { }
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
  async getDefaultOrg() {
    return this.getOrgByCode(DEFAULT_ORG_CODE);
  }
  /**
   *
   * @param orgCode
   * @returns
   * @description 根据组织编码获取组织
   */
  async getOrgByCode(orgCode: string) {
    return await this.orgRepository.findOne({
      select: this.getSelect(),
      where: {
        org_code: orgCode,
        deleted: 0
      },
    });
  }
  /**
 *
 * @param orgCode
 * @returns
 * @description 根据组织编码获取组织
 */
  async getOrgById(id: number) {
    return await this.orgRepository.findOne({
      select: this.getSelect(),
      where: {
        id,
        deleted: 0
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
        deleted: 0
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
        throw new BusinessException(ERROR_CODE_ENUM.ERROR_CODE_20000)
      }
    } else {
      code = await this.utilService.generateUUID();
    }
    const parentOrg = await this.getOrgById(parent_id);
    const path = `${parentOrg.path}/${code}`;
    const org = this.orgRepository.create({ ...rest, org_code: code, path });
    return await this.orgRepository.save(org);
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
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
