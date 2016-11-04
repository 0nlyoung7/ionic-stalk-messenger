import { Injectable } from '@angular/core';

declare var Stalk: any;

@Injectable()
export class SharedService {
  public host = 'http://127.0.0.1:8080';
  public app = 'chat-tutorial';

  xpush:any;
  stalk:any;

  constructor() {
    this.stalk = new Stalk(this.host, this.app);
  }
}