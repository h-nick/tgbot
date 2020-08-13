export enum TypeOfMessage {
  NORMAL,
  COMMAND,
}

export enum Command {
  TEST,
  CENSOR,
  TIMECENSOR,
  KICK,
}

export interface SendMessageObj {
  chat_id: number;
  text: string;
  parse_mode: string;
  reply_to_message_id?: number;
}
