import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';
import { merge } from 'lodash';

const BASE_CONFIG_FILENAME = 'base.yaml';

const basePath = join(__dirname, '../config', BASE_CONFIG_FILENAME);

const envPath = join(
  __dirname,
  '../config',
  `${process.env.NODE_ENV || 'development'}.yaml`,
);

const baseConfig: any = load(readFileSync(basePath, 'utf-8'));
const envConfig: any = load(readFileSync(envPath, 'utf-8'));

// 因为ConfigModule有一个load方法->函数
export default () => {
  return merge(baseConfig, envConfig);
};
