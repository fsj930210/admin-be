import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('organization')
@Tree('materialized-path')
export class Organization extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '组织名称',
  })
  @Column({
    type: 'varchar',
    length: 64,
    comment: '组织名称',
  })
  org_name: string;

  @ApiProperty({
    type: String,
    description: '组织编码',
  })
  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
    comment: '组织名称',
  })
  org_code: string;

  @ApiProperty({
    type: String,
    description: '组织路径',
  })
  @Column({
    type: 'varchar',
    length: 1024,
    comment: '组织路径',
  })
  path: string;

  @ApiProperty({
    type: Number,
    description: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序',
  })
  @Column({
    type: 'int',
    comment: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序 ',
    default: 0,
  })
  order_no: number;

  @ApiProperty({
    description: '父节点',
  })
  @TreeParent()
  parent?: Organization | null;

  @ApiProperty({
    description: '子节点',
  })
  @TreeChildren({ cascade: true })
  children!: Organization[];

  @OneToMany(() => User, (users) => users.organization)
  users: User[];
}
