import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './configuration';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/auth.guard';
import { RoleModule } from './modules/role/role.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { MenuModule } from './modules/menu/menu.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),

    // mysql
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        autoLoadEntities: true, // 开启加载后使用uuid做主键开发环境会报主键重复的错误
        // entities: ['dist/modules/**/entities/*.entity{.ts,.js}'], // 数据表实体
        host: configService.get<string>('mysql.host'), // 主机
        port: configService.get<number>('mysql.port'), // 端口号
        username: configService.get<string>('mysql.username'), // 用户名
        password: configService.get<string>('mysql.password'), // 密码
        database: configService.get<string>('mysql.database'), //数据库名
        timezone: configService.get<string>('mysql.timezone'), //服务器上配置的时区
        synchronize: configService.get<boolean>('mysql.synchronize'), //根据实体自动创建数据库表， 生产环境建议关闭
        logging: configService.get<boolean>('mysql.logging'), //是否打印日志
      }),
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('redis.host');
        const port = configService.get<string>('redis.port');
        const password = configService.get<string>('redis.password');
        const db = configService.get<string>('redis.db');
        const keyPrefix = configService.get<string>('redis.prefix');
        const url = password ? `redis://${password}@${host}:${port}` : `redis://${host}:${port}`;
        return {
          db,
          keyPrefix,
          config: {
            url,
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    UserModule,
    PostsModule,
    RoleModule,
    OrganizationModule,
    MenuModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
