import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '@/modules/role/entities/role.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { Profile } from './profile.entity';

@Entity('user')
export class User extends BaseEntity {
  @ApiProperty({
    type: String,
    description: '用户名',
  })
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户名',
  })
  username: string;

  @ApiProperty({
    type: String,
    description: '用户密码',
  })
  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    select: false,
    comment: '用户密码',
  })
  password: string;

  @ApiProperty({
    type: Number,
    description: '用户状态 0-不可用 1-可用',
  })
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '用户状态 0-不可用 1-可用',
  })
  status: number;

  @ApiProperty({
    type: String,
    description: '备注',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '备注',
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

  @ApiHideProperty()
  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ApiHideProperty()
  @ManyToOne(() => Organization, (orgs) => orgs.users)
  @JoinColumn({ name: 'org_id' })
  organization: Organization;

  @ApiHideProperty()
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // @BeforeInsert()
  // async encryptPwd() {
  //   if (!this.password) return;
  //   this.password = await hash(this.password, 10);
  // }
}
