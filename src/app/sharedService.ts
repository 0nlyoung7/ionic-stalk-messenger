import { Injectable } from '@angular/core';

declare var XPush: any;
declare var S5: any;

@Injectable()
export class SharedService {
  //public host = 'http://session.stalk.io:8000';
  public host = 'http://192.168.0.10:8080';
  public app = 'chat-tutorial';

  xpush:any;
  s5:any;

  constructor() {
    this.xpush = new XPush(this.host, this.app);
    this.s5 = new S5(this.host, this.app);
  }
}