import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { DEFAULT_ORG_CODE } from '@/common/constants';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepository: Repository<Organization>,
  ) {}
  /*
   * @returns
   * @description 返回指定字段
   */
  getSelect(): (keyof Organization)[] {
    return ['id', 'org_name', 'org_code'];
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
      },
    });
    return org;
  }
  create(createOrganizationDto: CreateOrganizationDto) {
    return 'This action adds a new organization';
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
}
