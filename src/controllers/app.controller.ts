import { Controller, Post, Req, Res, Get } from '@nestjs/common';

/*
  This controller handles all requests to the base / endpoint.

  Telegram API sends messages to the /new-message endpoint. The base / endpoint is included
  to avoid webhook spams.
*/

@Controller('/')
export class AppController {

  // Returns HTTP 200 on all GET and POST requests to the base / endpoint.
  @Get()
  returnEmptyOnBaseGet(@Res() res): void {
    return res.status(200).send();
  }

  @Post()
  returnEmptyOnBasePost(@Res() res): void {
    return res.status(200).send();
  }
}
