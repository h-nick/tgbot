import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: `https://api.telegram.org/${process.env.TG_API_KEY}`,
    }),
  ],
  controllers: [AppController, MessageController],
  providers: [MessageService, AdminService],
})
export class AppModule { }
