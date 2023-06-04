import { AUTHORIZE_KEY_METADATA } from '@/common/constants';
import { SetMetadata } from '@nestjs/common';

export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);
