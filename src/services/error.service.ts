import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageService } from './message.service';
import { LocaleService } from 'src/services/locale.service';

/*
  Service handles controller and other services errors thrown inside a try-catch block.
*/

@Injectable()
export class ErrorService {
  constructor(
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly localeService: LocaleService,
  ) { }

  async handleError(errorCatched: string) {
    try {
      /*
        On development builds, the actual exception will be sent as a message to the
        bot default group. Since these may contain sensitive information, this is
        disabled for production builds (where NODE_ENV is set to anything else
        other than "development").
      */

      const nodeEnv = this.configService.get<string>('runtime.NODE_ENV');
      let errorMsg;

      if (nodeEnv === 'development') {
        errorMsg = await this.localeService.getErrorString(errorCatched);
      } else {
        errorMsg = await this.localeService.getErrorString();
      }

      await this.messageService.sendMessage(
        this.configService.get<number>('bot.DEFAULT_GROUP_ID'),
        errorMsg,
      );
    } catch (error) {
      console.log('Something went wrong with the Error Service.');
    }

    console.log(errorCatched);
  }
}
