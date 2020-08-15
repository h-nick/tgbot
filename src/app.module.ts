import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { AdminService } from './services/admin.service';
import { ExtApiService } from './services/extapi.service';
import { ExtApiModule } from './extapi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      baseURL: `https://api.telegram.org/${process.env.TG_API_KEY}`,
      timeout: 15000,
    }),
    ExtApiModule,
  ],
  controllers: [AppController, MessageController],
  providers: [MessageService, AdminService],
})
export class AppModule { }
