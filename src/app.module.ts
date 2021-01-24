import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageController } from './controllers/message.controller';
import { AdminService } from './services/admin.service';
import { ExtApiModule } from './extapi.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './services/cron.service';
import configuration from '../config/configuration.default';
import { ErrorModule } from './error.module';
import { MessagesModule } from './messages.module';
import { RedisModule } from './redis.module';
import { RedisService } from './services/redis.service';

const configObj = {
  isGlobal: true,
  load: [configuration],
};

const httpObj = {
  useFactory: async (configService: ConfigService) => ({
    baseURL: `https://api.telegram.org/${configService.get<string>('api.TG_API_KEY')}`,
    timeout: 15000,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(configObj),
    HttpModule.registerAsync(httpObj),
    ExtApiModule,
    ErrorModule,
    MessagesModule,
    RedisModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AdminService, CronService, RedisService],
})
export class AppModule {}
