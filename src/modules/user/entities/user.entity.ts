import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/common/entities/base.entity';

export class UserEntity extends BaseEntity {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 32, nullable: true, unique: true })
  username: string;

  @ApiProperty({ description: '用户密码' })
  @Exclude()
  @Column({ select: false, nullable: true })
  password: string;

  @ApiProperty({ description: '用户状态 1-可用 2-不可用' })
  @Column('enum', { enum: [1, 2], default: 1 })
  status: number;

  @ApiProperty({
    description:
      '用户是否删除 0-未删除 1-已删除 删除用户时不能直接删除数据库数据需要软删除',
  })
  @Column('enum', { enum: [0, 1], default: 0 })
  deleted: number;
}
