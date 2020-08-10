import { Controller, Post, Req, Res, Get } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { TypeOfMessage } from '../data/message.data';

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

        if (typeOfMessage === TypeOfMessage.COMMAND) {
          // TODO: Handle commands.
        } else if (typeOfMessage === TypeOfMessage.NORMAL) {
          // TODO: Handle normal messages.
        }
      }
    } catch (error) {

      console.log(error);

      // TODO: Handle errors.
    }

    return res.status(200).send();
  }
}
