import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { TypeOfMessage, Command } from '../data/message.data';

/*
  This controller handles all requests to the /new-message endpoint.
*/

@Controller('/new-message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
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
              await this.messageService.sendMessageToGroup('Test message');
              break;
          }
        }
      }
    } catch (error) {

      console.log(error);

      // TODO: Handle errors.
    }

    return res.status(200).send();
  }
}
