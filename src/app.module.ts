import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MessageService],
})
export class AppModule { }
