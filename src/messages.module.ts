/*
  This module is used to handle messaging to Telegram groups.
*/
import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageService } from './services/message.service';

const httpObj = {
  useFactory: async (configService: ConfigService) => ({
    baseURL: `https://api.telegram.org/${configService.get<string>('api.TG_API_KEY')}`,
    timeout: 15000,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    HttpModule.registerAsync(httpObj),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessagesModule { }
