/*
  This module is used to handle external API (other than Telegram API) requests.
*/
import { Module, HttpModule } from '@nestjs/common';
import { ErrorModule } from './error.module';
import { ExtApiService } from './services/extapi.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
    }),
    ErrorModule,
  ],
  providers: [ExtApiService],
  exports: [ExtApiService],
})
export class ExtApiModule { }
