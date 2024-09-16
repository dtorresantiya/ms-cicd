import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(payload: any): string {
    console.log(payload);
    return 'Hello World!';
  }
}
