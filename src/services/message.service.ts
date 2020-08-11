import { TypeOfMessage, Command } from '../data/message.data';

/*
  Service determines types of messages and commands send.
*/

@Injectable()
export class MessageService {

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

}
