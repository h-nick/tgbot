import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ExtApiService } from './extapi.service';
import { MessageService } from './message.service';
import * as strings from '../messages/strings';
import { ErrorService } from './error.service';

/*
  Service handles all methods subjected to a cron job.
  Cron times are UTC based.
*/

@Injectable()
export class CronService {
  constructor(
    private readonly messageService: MessageService,
    private readonly extApiService: ExtApiService,
    private readonly configService: ConfigService,
    private readonly errorService: ErrorService,
  ) { }

  @Cron('0 16 * * *')
  async dailyPair() {
    try {
      const users = await this.extApiService.getFirebaseData('users');
      const prizes = await this.extApiService.getFirebaseData('prizes');
      let chatId = await this.extApiService.getFirebaseData('chatId');

      if (!users || !prizes) {
        throw new Error('Either users or prizes were not defined in Firebase.');
      }

      if (!chatId) {
        chatId = this.configService.get<number>('bot.DEFAULT_GROUP_ID');
      }

      const userKeys = Object.keys(users);

      const randomValues = [
        Math.floor(Math.random() * userKeys.length),
        Math.floor(Math.random() * userKeys.length),
        Math.floor(Math.random() * Object.keys(prizes).length),
      ];

      // Ensure the same person can't be picked twice by RNG.
      do {
        randomValues[0] = Math.floor(Math.random() * userKeys.length);
      } while (randomValues[0] === randomValues[1]);

      const selectedUsers = [
        users[userKeys[randomValues[0]]],
        users[userKeys[randomValues[1]]],
      ];

      const selectedUsersLinks = [
        `<a href='tg://user?id=${selectedUsers[0].id}'>${userKeys[randomValues[0]]}</a>`,
        `<a href='tg://user?id=${selectedUsers[1].id}'>${userKeys[randomValues[1]]}</a>`,
      ];

      const selectedPrize = prizes[Object.keys(prizes)[randomValues[2]]];

      this.messageService.sendMessage(
        chatId,
        strings.DAILY_PAIR(selectedUsersLinks, selectedPrize),
      );
    } catch (error) {
      this.errorService.handleError(error);
    }
  }
}
