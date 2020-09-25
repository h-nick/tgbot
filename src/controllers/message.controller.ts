import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { TypeOfMessage, Command } from '../data/message.data';
import { AdminService } from '../services/admin.service';
import { ExtApiService } from '../services/extapi.service';
import { ConfigService } from '@nestjs/config';
import { CronService } from '../services/cron.service';
import { ErrorService } from '../services/error.service';
import { LocaleService } from '../services/locale.service';

/*
  This controller handles all requests to the /new-message endpoint.
*/

@Controller('/new-message')
export class MessageController {
  private message;

  constructor(
    private readonly messageService: MessageService,
    private readonly adminService: AdminService,
    private readonly extApiService: ExtApiService,
    private readonly configService: ConfigService,
    private readonly cronService: CronService,
    private readonly errorService: ErrorService,
    private readonly localeService: LocaleService,
  ) { }

  async handleTestCommand(): Promise<void> {
    const botName = this.configService.get<string>('bot.BOT_NAME');
    const botUsername = this.configService.get<string>('bot.BOT_USERNAME');

    await this.messageService.sendMessage(
      this.message.chat.id,
      await this.localeService.getTestString(botName, botUsername),
    );
  }

  async handleCensorCommand(duration: number = 35): Promise<void> {
    // Censor command only works when replying to a message.
    if (!this.message.reply_to_message) {
      this.messageService.sendMessage(
        this.message.chat.id,
        await this.localeService.getErrorNoReplyIdOnCensorString(),
        this.message.message_id,
      );

      return;
    }

    // Ensure duration is a number higher than 35 seconds.
    if (isNaN(duration) || duration < 35) {
      duration = 35;
    }

    // Ensure duration is not higher than the max vaue.
    const maxCensorDurationValue = (
      this.configService.get<number>('bot.CENSOR_DURATION_MAX_VALUE')
    );

    if (duration > maxCensorDurationValue) {
      duration = maxCensorDurationValue;
    }

    const tName = this.messageService.getUsernameLink(this.message.reply_to_message.from);
    let resStatus;

    try {
      resStatus = await this.adminService.censorUser(
        this.message.chat.id,
        this.message.reply_to_message.from.id,
        duration,
      );
    } catch (error) {
      if (error.response.status === 400) {
        // User can't be censored
        await this.messageService.sendMessage(
          this.message.chat.id,
          await this.localeService.getCensorErrorString(),
          this.message.message_id,
        );

        return;
      }

      throw new Error('Error @censorUser() <- handleCensorCommand()');
    }

    if (!resStatus.data.ok) {
      this.messageService.sendMessage(
        this.message.chat.id,
        await this.localeService.getCensorString(tName, duration),
        this.message.reply_to_message.message_id,
      );
    } else {
      throw new Error('Error @handleCensorCommand() -> resStatus');
    }
  }

  async handleYoutube(searchParam: string): Promise<void> {
    const link = await this.extApiService.getYoutubeLink(searchParam);

    if (!link) {
      await this.messageService.sendMessage(
        this.message.chat.id,
        await this.localeService.getYtNotFound(searchParam),
        this.message.message_id,
      );

      return;
    }

    await this.messageService.sendMessage(
      this.message.chat.id,
      await this.localeService.getYtFound(link),
      this.message.message_id,
    );
  }

  @Post()
  async handleMessage(@Req() req, @Res() res): Promise<void> {
    try {
      this.message = req.body.message;

      // Only handle text messages. Stickers, videos, photos, etc. are ignored.
      if (this.message.text) {
        const typeOfMessage = this.messageService.getTypeOfMessage(this.message.text);

        // So far only commands will be handled. It can be easily escalated to handle
        // normal messages too.
        if (typeOfMessage === TypeOfMessage.COMMAND) {
          const command = this.messageService.getCommand(this.message.text);

          // No need for a default case. It will return in the end.
          switch (command) {
            case Command.TEST:
              await this.handleTestCommand();
              break;

            case Command.CENSOR:
              const duration = this.messageService.getCommandParams(this.message.text);
              await this.handleCensorCommand(duration[0]);
              break;

            case Command.FORCE_DAILYPAIR:
              this.cronService.dailyPair();
              break;

            case Command.YOUTUBE_THIS:
              /*
                The youtube_this command works by fetching the first youtube result
                based on a search param.

                This param is either taken from a reply message text or directly from
                the command param.
              */

              let param;

              if (this.message.reply_to_message) {
                param = this.message.reply_to_message.text;
              } else {
                param = this.messageService.getCommandFullParam(this.message.text);
              }

              // If no param was determined.
              if (!param) {
                this.messageService.sendMessage(
                  this.message.chat.id,
                  await this.localeService.getYtNoQueryString(),
                  this.message.message_id,
                );

                break;
              }

              await this.handleYoutube(param);
              break;
          }
        }
      }
    } catch (error) {
      this.errorService.handleError(error);
    }

    return res.status(200).send();
  }
}
