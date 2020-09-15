import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { MessageService } from './message.service';

/*
  Service handles all i18n related operations.
*/

@Injectable()
export class LocaleService {
  private lang;

  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.lang = this.configService.get<string>('bot.BOT_LANG');
  }

  async getTestString(botName: string, botUsername: string): Promise<string> {
    return await this.i18n.translate('strings.TEST', {
      lang: this.lang,
      args: {
        botName,
        botUsername,
      },
    });
  }

  async getErrorString(error?: string): Promise<string> {
    return await this.i18n.translate('strings.ERROR', {
      lang: this.lang,
      args: {
        error: error || '...',
      },
    });
  }

  async getErrorNoReplyIdOnCensorString(): Promise<string> {
    return await this.i18n.translate('strings.ERROR_NO_REPLY_ID_ON_CENSOR', {
      lang: this.lang,
    });
  }

  async getCensorString(username: string, duration: number): Promise<string> {
    return await this.i18n.translate('strings.CENSOR', {
      lang: this.lang,
      args: {
        username,
        duration,
      },
    });
  }

  async getCensorErrorString(): Promise<string> {
    return await this.i18n.translate('strings.CENSOR_ERROR', {
      lang: this.lang,
    });
  }

  async getYtNoQueryString(): Promise<string> {
    return await this.i18n.translate('strings.YT_NO_QUERY', {
      lang: this.lang,
    });
  }

  async getYtNotFound(searchParam: string): Promise<string> {
    return await this.i18n.translate('strings.YT_NOT_FOUND', {
      lang: this.lang,
      args: {
        searchParam,
      },
    });
  }

  async getYtFound(link: string): Promise<string> {
    return await this.i18n.translate('strings.YT_FOUND', {
      lang: this.lang,
      args: {
        link,
      },
    });
  }

  async getDailyPairString(link1: string, link2: string, prize: string): Promise<string> {
    return await this.i18n.translate('strings.DAILY_PAIR', {
      lang: this.lang,
      args: {
        link1,
        link2,
        prize,
      },
    });
  }
}

export const TEST_STRING = (botUsername: string, botName: string) => (
  `
  <b>${botName} now enabled</b>
  ${botUsername}

  Version: 2.0
  Available on GitHub: https://github.com/hniklass/tgbot
  `
);
