import { Injectable } from '@angular/core';

declare var Stalk: any;

@Injectable()
export class SharedService {
  public host = 'https://im.stalk.io';
  public app = 'STALK';
  stalk:any;

  unreadCounts:any;
  lastestMessages:any;

  constructor() {
    this.stalk = new Stalk(this.host, this.app);
    this.unreadCounts = {};
    this.lastestMessages = {};
  }

  public plusUnreadCount(channel, count){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    }
    this.unreadCounts[channel] = this.unreadCounts[channel] + count;
  }

  public clearUnreadCount(channel){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    } 
    this.unreadCounts[channel] = 0;
  }

  public getUnreadCount(channel){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    }
    return this.unreadCounts[channel];
  }

  public setLatestMessage(channel,msg){
    this.lastestMessages[channel] = msg;
  }

  public getLatestMessage(channel){
    return (this.lastestMessages[channel] || "");
  }
}