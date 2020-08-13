import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { TypeOfMessage, Command } from '../data/message.data';
import * as strings from '../messages/strings';
import { AdminService } from 'src/services/admin.service';

/*
  This controller handles all requests to the /new-message endpoint.
*/

@Controller('/new-message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly adminService: AdminService,
  ) { }

  @Post()
  async handleMessage(@Req() req, @Res() res): Promise<void> {
    try {
      const message = req.body.message;

      // Only handle text messages. Stickers, videos, photos, etc. are ignored.
      if (message.text) {
        const typeOfMessage = this.messageService.getTypeOfMessage(message.text);

        // So far only commands will be handled. It can be easily escalated to handle
        // normal messages too.
        if (typeOfMessage === TypeOfMessage.COMMAND) {
          const command = this.messageService.getCommand(message.text);

          // No need for a default case. It will return in the end.
          switch (command) {
            case Command.TEST:
              await this.messageService.sendMessage(message.chat.id, strings.TEST_STRING());
              break;

            case Command.CENSOR:
            case Command.SUPERCENSOR:
            case Command.MEGACENSOR:
              let msg;
              let duration;
              const uName = message.from.username || message.from.first_name;

              // TODO: Dynamic times
              if (command === Command.CENSOR) {
                duration = 30;
              } else if (command === Command.SUPERCENSOR) {
                duration = 60;
              } else {
                duration = 300;
              }

              // Censor command only works when replyig to a message.
              if (!message.reply_to_message) {
                msg = strings.ERROR_NO_REPLY_ID_ON_CENSOR(uName);
                this.messageService.sendMessage(message.chat.id, msg, message.message_id);
                break;
              }

              const resStatus = await this.adminService.censorUser(
                message.chat.id,
                message.reply_to_message.from.id,
                duration,
              );

              // If censorUser() is successful, it will return true.
              if (!resStatus) {
                msg = strings.CENSOR_ERROR();
                this.messageService.sendMessage(message.chat.id, msg, message.from.id);
              } else {
                msg = strings.CENSOR_MESSAGE(uName, duration);

                await this.messageService.sendMessage(
                  message.chat.id,
                  msg,
                  message.reply_to_message.message_id,
                );
              }
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
      if (process.env.NODE_ENV === 'development') {
        errorMsg = strings.ERROR_STRING(error);
      } else {
        errorMsg = strings.ERROR_STRING();
      }

      console.log(errorMsg);

      await this.messageService.sendMessage(Number(process.env.DEFAULT_GROUP_ID), errorMsg);
    }

    return res.status(200).send();
  }
}
