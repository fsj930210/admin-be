import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import dayjs from 'dayjs';

export abstract class BaseEntity {
  @ApiProperty({ type: Number, description: 'id' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint', comment: 'id' })
  id: number;

  @ApiProperty({ type: Number, description: '创建者' })
  @Column({
    type: 'bigint',
    nullable: true,
    comment: '创建人',
  })
  create_user: number | null;

  @ApiProperty({
    type: Date,
    description: '创建时间',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), { toPlainOnly: true })
  @CreateDateColumn({
    type: 'datetime',
    nullable: false,
    comment: '创建时间',
  })
  created_at: Date | null;

  @ApiProperty({ type: Number, description: '更新人' })
  @Column({
    type: 'bigint',
    nullable: true,
    comment: '更新人',
  })
  update_user: number | null;

  @ApiProperty({
    type: Date,
    description: '更新时间',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), { toPlainOnly: true })
  @UpdateDateColumn({
    type: 'datetime',
    nullable: false,
    comment: '更新时间',
  })
  updated_at: Date | null;

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

  @ApiProperty({ type: Number, description: '删除人' })
  @Exclude()
  @Column({
    type: 'bigint',
    nullable: true,
    comment: '删除人',
  })
  delete_user: number | null;

  @ApiProperty({
    type: Date,
    description: '删除时间',
  })
  @Exclude()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), { toPlainOnly: true })
  @DeleteDateColumn({
    type: 'datetime',
    nullable: false,
    select: false,
    comment: '删除时间',
  })
  deleted_at: Date | null;

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
}
