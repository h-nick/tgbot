/*
  This module is used to handle external API (other than Telegram API) requests.
*/
import { Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';

@Module({
  imports: [],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule { }
