import { Injectable } from '@angular/core';

declare var XPush: any;

@Injectable()
export class SharedService {
  public host = 'http://session.stalk.io:8000';
  public app = 'chat-tutorial';

  xpush:any;
  constructor() {
    this.xpush = new XPush(this.host, this.app);
  }
}