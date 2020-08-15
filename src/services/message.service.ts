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

  getUsernameLink(fromData: any): string {
    if (fromData.username) {
      return `@${fromData.username}`;
    } else {
      return `<a href='tg://user?id=${fromData.id}'>${fromData.first_name}</a>`;
    }
  }

  getTypeOfMessage(text: string): TypeOfMessage {
    // All Telegram commands start with "/", therefore we'll use this to determine
    // if we're dealing with a command or a normal text message.
    if (text.startsWith('/')) {
      return TypeOfMessage.COMMAND;
    } else {
      return TypeOfMessage.NORMAL;
    }
  }

  getCommandParams(text: string): any[] {
    const regex = /\s(.*)/;
    const paramsTemp = text.match(regex);
    let params = [];

    if (paramsTemp) {
      params = paramsTemp[1].split(' ');
    }

    return params.filter(Boolean);
  }

  getCommandFullParam(text: string): string {
    const regex = /\s(.*)/;
    const paramTemp = text.match(regex);

    if (!paramTemp) {
      return null;
    }

    const param = paramTemp[1].trim();

    if (Boolean(param)) {
      return param;
    } else {
      return null;
    }
  }

  getCommand(text: string): Command {
    // Extract the actual command from the bot.

    // Regex captures the actual command (between "/" and "@<botname>")
    const regex = /\/(.+)@/;
    const command = text.match(regex)[1].toUpperCase();

    /*
      String is mapped to the Command Enum.
      This way, if we add new commands, only the Enum needs to be changed
      instead of a complex if/switch statement.
    */
    return Command[command as keyof typeof Command];

    /*
      For more reference about "as keyof typeof", check
      https://stackoverflow.com/questions/55377365/what-does-keyof-typeof-mean-in-typescript
    */
  }

  async sendMessage(targetChat: number, text: string, replyId?: number): Promise<any> {
    // Depending on whether we're answering to another message or not, the object
    // will change.
    const objRes: SendMessageObj = {
      chat_id: targetChat,
      text,
      parse_mode: 'HTML',
    };

    if (replyId) {
      objRes.reply_to_message_id = replyId;
    }

    return await this.httpService.post('/sendMessage', objRes).toPromise();
  }

  async pinMessage(
    targetChat: number,
    targetMessage: number,
    notify: boolean = false,
  ): Promise<any> {
    const objRes = {
      chat_id: targetChat,
      message_id: targetMessage,
      disable_notification: !notify,
    };

    return await this.httpService.post('/pinChatMessage', objRes).toPromise();
  }
}
