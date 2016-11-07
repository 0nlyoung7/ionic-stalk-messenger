import { Injectable } from '@angular/core';

declare var Stalk: any;

@Injectable()
export class SharedService {
  public host = 'https://im.stalk.io';
  public app = 'STALK';
  stalk:any;

  constructor() {
    this.stalk = new Stalk(this.host, this.app);
  }
}