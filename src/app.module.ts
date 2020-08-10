import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MessageService } from './services/message.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MessageService],
})
export class AppModule { }
