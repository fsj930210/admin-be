import { BaseEntity } from '@/common/entities/base.entity';
import { Role } from '@/modules/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('menu')
export class Menu extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '菜单名称',
  })
  @Column({
    type: 'varchar',
    length: 64,
    comment: '菜单名称',
  })
  meun_name: string;

  @ApiProperty({
    type: String,
    description: '菜单编码',
  })
  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
    comment: '菜单编码',
  })
  menu_code: string;

  @ApiProperty({
    type: String,
    description: '菜单url，按钮菜单可不用传',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '菜单url，按钮菜单可不用传',
  })
  url: string | null;

  @ApiProperty({
    type: Number,
    description: '父菜单ID',
  })
  @Column({
    type: 'bigint',
    comment: '父菜单ID',
  })
  parent_id: number;

  @ApiProperty({
    type: Number,
    description: '菜单类型 1-菜单(url) 2-按钮',
  })
  @Column({
    type: 'tinyint',
    comment: '菜单类型 1-菜单(url) 2-按钮',
    default: 1,
  })
  type: number;

  @ApiProperty({
    type: Number,
    description: '菜单类型 1-本应用打开 2-外链打开',
  })
  @Column({
    type: 'tinyint',
    comment: '菜单类型 1-本应用打开 2-外链打开',
    default: 1,
  })
  open_mode: number;

  @ApiProperty({
    type: Boolean,
    description: '是否展示该菜单',
  })
  @Column({
    type: 'boolean',
    comment: '是否展示该菜单',
    default: true,
  })
  is_show: boolean;

  @ApiProperty({
    type: String,
    description: '菜单图标',
  })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    comment: '菜单图标',
  })
  icon: string | null;

  @ApiProperty({
    type: Number,
    description: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序',
  })
  @Column({
    type: 'int',
    comment: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序 ',
    default: 0,
  })
  order: number;

  @ApiProperty({
    type: Object,
    description: '扩展字段-原样返回-客户端可以存储一些菜单额外字段',
  })
  @Column({
    type: 'json',
    nullable: true,
    comment: '扩展字段-原样返回-客户端可以存储一些菜单额外字段',
  })
  ext: object | null;

  @ManyToMany(() => Role, (roles) => roles.menus)
  @JoinTable({
    name: 'role_menu',
    joinColumn: {
      name: 'menu_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
    },
  })
  roles: Role[];
}
