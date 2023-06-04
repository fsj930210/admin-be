import { SetMetadata } from '@nestjs/common';
import { NOT_TRANSFORM_METADATA } from '../constants';

/**
 * 不转化成JSON结构，保留原有返回
 */
export const Keep = () => SetMetadata(NOT_TRANSFORM_METADATA, true);
