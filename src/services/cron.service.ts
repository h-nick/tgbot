import { Injectable, HttpService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageService } from './message.service';

/*
  Service handles all methods subjected to a cron job.
  Cron times are UTC based.
*/

@Injectable()
export class CronService {
  constructor(
    private readonly httpService: HttpService,
    private readonly msgService: MessageService,
  ) { }

  /* @Cron('0 16 * * *')
  async dailyPair() {
  } */
}
