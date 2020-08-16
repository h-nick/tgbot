import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { AdminService } from './services/admin.service';
import { ExtApiService } from './services/extapi.service';
import { ExtApiModule } from './extapi.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './services/cron.service';
import configuration from '../config/configuration.default';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `https://api.telegram.org/${configService.get<string>('api.TG_API_KEY')}`,
        timeout: 15000,
      }),
      inject: [ConfigService],
    }),
    ExtApiModule,
  ],
  controllers: [AppController, MessageController],
  providers: [MessageService, AdminService, CronService],
})
export class AppModule { }
