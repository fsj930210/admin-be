import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { GENDER_ENUM } from '@/common/enum';

@Entity()
export class Profile {
  @ApiProperty({ description: '个人信息id' })
  @PrimaryGeneratedColumn('increment', { comment: '个人信息id' })
  id: number;

  @ApiProperty({ description: '性别' })
  @Column({ type: 'enum', enum: GENDER_ENUM, comment: '性别' })
  gender: number;

  @ApiProperty({ description: '头像' })
  @Column({ comment: '头像' })
  avatar: string;

  @ApiProperty({ description: '地址' })
  @Column({ length: 255, comment: '地址' })
  address: string;

  @ApiProperty({ description: '职位' })
  @Column({ comment: '职位' })
  position: string;

  @ApiProperty({ description: '简介' })
  @Column({ length: 255, comment: '简介' })
  remark: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
