import { User } from '@/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @ApiProperty({ description: '组织id' })
  @PrimaryGeneratedColumn('increment', { comment: '组织id' })
  id: number;

  @ApiProperty({ description: '组织名称' })
  @Column({ length: 64, comment: '组织名称' })
  name: string;

  @ApiProperty({ description: '父组织id' })
  @Column({ comment: '父组织id' })
  parent_id: number;

  @ApiProperty({ description: '组织级联路径' })
  @Column({ comment: '组织级联路径' })
  path: string;

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

  @ManyToMany(() => User, (users) => users.orgs)
  users: User[];
}
