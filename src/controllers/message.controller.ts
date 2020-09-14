import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { TypeOfMessage, Command } from '../data/message.data';
import * as strings from '../messages/strings';
import { AdminService } from '../services/admin.service';
import { ExtApiService } from '../services/extapi.service';
import { ConfigService } from '@nestjs/config';
import { CronService } from './../services/cron.service';

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
  ) { }

  async handleTestCommand(): Promise<void> {
    await this.messageService.sendMessage(this.message.chat.id, strings.TEST_STRING());
  }

  async handleCensorCommand(duration: number = 35): Promise<void> {
    // Censor command only works when replying to a message.
    if (!this.message.reply_to_message) {
      this.messageService.sendMessage(
        this.message.chat.id,
        strings.ERROR_NO_REPLY_ID_ON_CENSOR(),
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

    const resStatus = await this.adminService.censorUser(
      this.message.chat.id,
      this.message.reply_to_message.from.id,
      duration,
    );

    const tName = this.messageService.getUsernameLink(this.message.reply_to_message.from);

    // If censorUser() is successful, it will return true.
    if (!resStatus.data.ok) {
      await this.messageService.sendMessage(
        this.message.chat.id,
        strings.CENSOR_ERROR(),
        this.message.message_id,
      );
    } else {
      await this.messageService.sendMessage(
        this.message.chat.id,
        strings.CENSOR_MESSAGE(tName, duration),
        this.message.reply_to_message.message_id,
      );
    }
  }

  async handleYoutube(searchParam: string): Promise<void> {
    const link = await this.extApiService.getYoutubeLink(searchParam);

    if (!link) {
      await this.messageService.sendMessage(
        this.message.chat.id,
        strings.YT_NOT_FOUND(searchParam),
        this.message.message_id,
      );

      return;
    }

    await this.messageService.sendMessage(
      this.message.chat.id,
      strings.YT_FOUND(link),
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
                  strings.YT_NO_QUERY(),
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

      console.log(error);
      let errorMsg;

      /*
        On development builds, the actual exception will be sent as a message to the
        bot group. Since these may contain sensitive information, this is disabled
        for production builds.
      */
      if (this.configService.get<string>('runtime.NODE_ENV')) {
        errorMsg = strings.ERROR_STRING(error);
      } else {
        errorMsg = strings.ERROR_STRING();
      }

      await this.messageService.sendMessage(
        this.configService.get<number>('bot.DEFAULT_GROUP_ID'),
        errorMsg,
      );
    }

    return res.status(200).send();
  }
}
