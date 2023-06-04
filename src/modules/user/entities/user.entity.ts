import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { hash } from 'bcryptjs';
import { Role } from '@/modules/role/entities/role.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Profile } from './profile.entity';

export type UserStatusType = 0 | 1;

export type UserDeletedType = 0 | 1;
@Entity()
export class User {
  @ApiProperty({ description: '用户id' })
  @PrimaryGeneratedColumn('increment', { comment: '用户id' })
  id: string;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 32, nullable: true, comment: '用户名' })
  username: string;

  @ApiProperty({ description: '用户编码' })
  @Column({ length: 36, nullable: true, unique: true, comment: '用户编码' })
  usercode: string;

  @ApiProperty({ description: '用户密码' })
  @Exclude()
  @Column({ length: 64, select: false, nullable: true, comment: '用户密码' })
  password: string;

  @ApiProperty({ description: '用户状态 0-不可用 1-可用' })
  @Column({
    type: 'enum',
    enum: [0, 1],
    default: 1,
    comment: '用户状态 0-不可用 1-可用',
  })
  status: UserStatusType;

  @ApiProperty({
    description: '软删除 0-未删除 1-已删除 枚举在数据库中存储为字符串',
  })
  @Exclude()
  @Column({
    select: false,
    type: 'enum',
    enum: [0, 1],
    default: 0,
    comment: '软删除 0-未删除 1-已删除',
  })
  deleted: UserDeletedType;

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

  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ManyToMany(() => Organization, (orgs) => orgs.users)
  @JoinTable({
    name: 'user_organization',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'org_id' },
  })
  orgs: Organization[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // @BeforeInsert()
  // async encryptPwd() {
  //   if (!this.password) return;
  //   this.password = await hash(this.password, 10);
  // }
}
