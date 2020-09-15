import { Injectable, HttpService } from '@nestjs/common';

/*
  Service includes actions to admin the BOT and the group chat.
*/

@Injectable()
export class AdminService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  async kickUser(targetChat: number, targetUser: number): Promise<any> {
    const objRes = {
      chat_id: targetChat,
      user_id: targetUser,
      until_date: Math.round(new Date(Date.now() + (60000)).getTime() / 1000),
    };

    return await this.httpService.post('/kickChatMember', objRes).toPromise();
  }

  async censorUser(
    targetChat: number,
    targetUser: number,
    seconds: number = 35,
  ): Promise<any> {

    const objRes = {
      chat_id: targetChat,
      user_id: targetUser,
      until_date: Math.round(new Date(Date.now() + (seconds * 1000)).getTime() / 1000),
      permissions: {
        can_send_messages: false,
        can_change_info: false,
        can_pin_messages: false,
      },
    };

    return await this.httpService.post('/restrictChatMember', objRes).toPromise();
  }
}
