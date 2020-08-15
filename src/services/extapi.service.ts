import { Injectable, HttpService } from '@nestjs/common';

/*
  Service determines types of messages and commands send.
*/

@Injectable()
export class ExtApiService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  async getYoutubeLink(searchParam: string): Promise<string> {
    const videoId = (
      await this.httpService.get(
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet` +
        `&maxResults=1` +
        `&q=${searchParam}` +
        `&fields=items%2Fid%2FvideoId` +
        `&key=${process.env.YT_API_KEY}`,
      ).toPromise()
    ).data?.items[0]?.id?.videoId;

    if (!videoId) {
      return null;
    }

    // Won't wrap it in an <a> tag. Telegram client will do that automatically.
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}
