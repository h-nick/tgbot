/*
  This module is used to handle messaging to Telegram groups.
*/
import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { LocaleService } from './services/locale.service';
import { MessageService } from './services/message.service';
import * as path from 'path';

const httpObj = {
  useFactory: async (configService: ConfigService) => ({
    baseURL: `https://api.telegram.org/${configService.get<string>('api.TG_API_KEY')}`,
    timeout: 15000,
  }),
  inject: [ConfigService],
};

const localeObj = {
  useFactory: async (configService: ConfigService) => ({
    fallbackLanguage: configService.get<string>('bot.BOT_LANG'),
    parserOptions: {
      path: path.join(__dirname, '../locale/'),
    },
  }),
  parser: I18nJsonParser,
  inject: [ConfigService],
};

@Module({
  imports: [
    HttpModule.registerAsync(httpObj),
    I18nModule.forRootAsync(localeObj),
  ],
  providers: [MessageService, LocaleService],
  exports: [MessageService, LocaleService],
})
export class MessagesModule { }
