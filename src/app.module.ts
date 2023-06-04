import { Dependencies, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getConfig from './getConfig';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { DataSource } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './modules/auth/auth.guard';
import { RoleModule } from './modules/role/role.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { MenuModule } from './modules/menu/menu.module';

@Dependencies(DataSource)
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        autoLoadEntities: true, // 开启加载后使用uuid做主键会报主键重复的错误
        // entities: ['dist/modules/**/entities/*.entity{.ts,.js}'], // 数据表实体
        host: configService.get('mysql.host', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('mysql.port', 3306), // 端口号
        username: configService.get('mysql.username', 'root'), // 用户名
        password: configService.get('mysql.password', 'shaojian06'), // 密码
        database: configService.get('mysql.database', 'admin_dev'), //数据库名
        timezone: configService.get('mysql.timezone', '+08:00'), //服务器上配置的时区
        synchronize: configService.get('mysql.synchronize', true), //根据实体自动创建数据库表， 生产环境建议关闭
        logging: true,
      }),
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
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
