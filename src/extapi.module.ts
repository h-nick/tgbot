/*
  This module is used to handle external API (other than Telegram API) requests.
*/
import { Module, HttpModule } from '@nestjs/common';
import { ExtApiService } from './services/extapi.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
    }),
  ],
  providers: [ExtApiService],
  exports: [ExtApiService],
})
export class ExtApiModule { }
