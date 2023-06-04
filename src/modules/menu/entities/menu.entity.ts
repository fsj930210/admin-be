import { Role } from '@/modules/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menu')
export class Menu {
  @ApiProperty({ description: '菜单ID' })
  @PrimaryGeneratedColumn('increment', { comment: '菜单ID' })
  id: number;

  @ApiProperty({ description: '菜单名称' })
  @Column({ length: 64, comment: '菜单名称' })
  name: string;

  @ApiProperty({ description: '菜单url，按钮菜单可不用传' })
  @Column({ length: 255, comment: '菜单url' })
  url: string;

  @ApiProperty({ description: '父菜单ID' })
  @Column({ comment: '父菜单ID' })
  parent_id: string;

  @ApiProperty({ description: '菜单类型 1-菜单(url) 2-按钮' })
  @Column({
    type: 'tinyint',
    comment: '菜单类型 1-菜单(url) 2-按钮',
    default: 1,
  })
  type: number;

  @ApiProperty({ description: '菜单类型 1-本应用打开 2-外链打开' })
  @Column({
    type: 'tinyint',
    comment: '菜单类型 1-本应用打开 2-外链打开',
    default: 1,
  })
  open_mode: number;

  @ApiProperty({ description: '是否展示该菜单' })
  @Column({
    type: 'boolean',
    comment: '是否展示该菜单',
    default: true,
  })
  is_show: boolean;

  @ApiProperty({ description: '菜单图标' })
  @Column({ comment: '菜单图标' })
  icon: string;

  @ApiProperty({ description: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序' })
  @Column({ type: 'int', comment: '序号，数值越大显示越靠前，如果相同序号按照创建时间排序 ', default: 0 })
  order: number;

  @ApiProperty({ description: '扩展字段-原样返回-客户端可以存储一些菜单额外字段' })
  @Column({
    type: 'json',
    comment: '扩展字段-原样返回-客户端可以存储一些菜单额外字段',
  })
  ext: object;

  @ApiProperty({ description: '创建时间' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @Exclude()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '更新时间',
  })
  updated_at: Date;

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
