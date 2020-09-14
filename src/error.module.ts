/*
  This module is used to handle external API (other than Telegram API) requests.
*/
import { Module } from '@nestjs/common';
import { MessagesModule } from './messages.module';
import { ErrorService } from './services/error.service';

@Module({
  imports: [MessagesModule],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule { }
