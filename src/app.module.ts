import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getConfig from './getConfig';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
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
        entities: ['dist/**/*.entity{.ts,.js}'], // 数据表实体
        host: configService.get('mysql.host', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('mysql.port', 3306), // 端口号
        username: configService.get('mysql.username', 'root'), // 用户名
        password: configService.get('mysql.password', 'root'), // 密码
        database: configService.get('mysql.database', 'admin_dev'), //数据库名
        timezone: configService.get('mysql.timezone', '+08:00'), //服务器上配置的时区
        synchronize: configService.get('mysql.synchronize', true), //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    UserModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
