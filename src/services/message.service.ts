import { Injectable, HttpService } from '@nestjs/common';
import { TypeOfMessage, Command } from '../data/message.data';
import { SendMessageObj } from '../data/message.data';

/*
  Service determines types of messages and commands send.
*/

@Injectable()
export class MessageService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  getTypeOfMessage(text: string): TypeOfMessage {

    // All Telegram commands start with "/", therefore we'll use this to determine
    // if we're dealing with a command or a normal text message.
    if (text.startsWith('/')) {
      return TypeOfMessage.COMMAND;
    } else {
      return TypeOfMessage.NORMAL;
    }
  }

  getCommand(text: string): Command {
    // Extract the actual command from the bot.
    const regex = /\/(.+)@/;
    const command = text.match(regex)[1];

    switch (command) {
      case 'testbot':
        return Command.TEST;

      default: return;
    }
  }

  async sendMessageToGroup(text: string, replyId?: number): Promise<any> {

    // Depending on whether we're answering to another message or not, the object
    // will change.
    const objRes: SendMessageObj = {
      chat_id: Number(process.env.GROUP_ID),
      text,
      parse_mode: 'HTML',
    };

    if (replyId) {
      objRes.reply_to_message_id = replyId;
    }

    return await this.httpService.post('/sendMessage', objRes).toPromise();
  }
}
