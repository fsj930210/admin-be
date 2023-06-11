import { BaseEntity } from '@/common/entities/base.entity';
import { Menu } from '@/modules/menu/entities/menu.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('role')
export class Role extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '角色名称',
  })
  @Column({
    type: 'varchar',
    comment: '角色名称',
  })
  role_name: string;

  @ApiProperty({
    type: String,
    description: '角色code',
  })
  @Column({
    length: 32,
    unique: true,
    type: 'varchar',
    comment: '角色code',
  })
  role_code: string;

  @ApiProperty({
    type: Number,
    description: '角色状态 0-不可用 1-可用',
  })
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '角色状态 0-不可用 1-可用',
  })
  status: number;

  @ApiProperty({
    type: String,
    description: '角色备注',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '角色备注',
  })
  remark: string;

  @ApiProperty({
    type: Number,
    description: '软删除 0-未删除 1-已删除',
  })
  @Exclude()
  @Column({
    type: 'tinyint',
    select: false,
    default: 0,
    comment: '软删除 0-未删除 1-已删除',
  })
  deleted: number;

  @ManyToMany(() => User, (users) => users.roles)
  users: User[];

  @ManyToMany(() => Menu, (menus) => menus.roles)
  menus: Menu[];
}
