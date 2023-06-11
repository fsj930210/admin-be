import { Module } from '@nestjs/common';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import { utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

function createDailyRotateTrasnport(level: string, filename: string) {
  return new winston.transports.DailyRotateFile({
    level,
    dirname: 'admin-be/logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '1m',
    maxFiles: '1d',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  });
}
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const timestamp = configService.get('logger.timestamp');
        const conbine = [];
        if (timestamp) {
          conbine.push(winston.format.timestamp());
        }
        conbine.push(utilities.format.nestLike());
        const consoleTransports = new Console({
          level: configService.get('logger.level', 'info'),
          format: winston.format.combine(...conbine),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get('logger.enable')
              ? [
                  createDailyRotateTrasnport('info', 'application'),
                  createDailyRotateTrasnport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
