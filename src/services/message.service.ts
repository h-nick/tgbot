import { Injectable } from '@nestjs/common';
import { TypeOfMessage } from '../data/message.data';

/*
  Service determines types of messages and commands send.
*/

@Injectable()
export class MessageService {

  getTypeOfMessage(text: string): TypeOfMessage {
    if (text.startsWith('/')) {
      return TypeOfMessage.COMMAND;
    } else {
      return TypeOfMessage.NORMAL;
    }
  }
}
