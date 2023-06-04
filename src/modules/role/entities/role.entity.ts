import { Menu } from '@/modules/menu/entities/menu.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role {
  @ApiProperty({ description: '角色ID' })
  @PrimaryGeneratedColumn('increment', { comment: '角色ID' })
  id: number;

  @ApiProperty({ description: '角色名称' })
  @Column({ comment: '角色名称' })
  name: string;

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

  @ManyToMany(() => User, (users) => users.roles)
  users: User[];

  @ManyToMany(() => Menu, (menus) => menus.roles)
  menus: Menu[];
}
