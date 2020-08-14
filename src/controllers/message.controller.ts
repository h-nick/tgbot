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
  private message;

  constructor(
    private readonly messageService: MessageService,
    private readonly adminService: AdminService,
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
        this.message.id,
      );
    } else {
      await this.messageService.sendMessage(
        this.message.chat.id,
        strings.CENSOR_MESSAGE(tName, duration),
        this.message.reply_to_message.message_id,
      );
    }
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

      await this.messageService.sendMessage(
        Number(process.env.DEFAULT_GROUP_ID),
        errorMsg,
      );
    }

    return res.status(200).send();
  }
}
