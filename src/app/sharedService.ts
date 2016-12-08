import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

declare var Stalk: any;

var LATEST_MESSAGE_KEY = "STALK:LMS";
var UNREAD_COUNT_KEY = "STALK:UCS";

@Injectable()
export class SharedService {
  public host = 'https://im.stalk.io';
  public app = 'STALK';

  stalk:any;
  storage:any;

  unreadCounts:any;
  lastestMessages:any;

  constructor(storage: Storage) {
  	this.storage = storage;
    this.stalk = new Stalk(this.host, this.app);
    this.unreadCounts = {};
    this.lastestMessages = {};
  }

  public initStorage(){
    this.loadUnreadCount();
    this.loadLatestMessage();
  }

  public plusUnreadCount(channel, count){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    }
    this.unreadCounts[channel] = this.unreadCounts[channel] + count;
    this.storage.set( this.stalk.currentUser().id +"_"+ UNREAD_COUNT_KEY, JSON.stringify( this.unreadCounts ) );
  }

  public clearUnreadCount(channel){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    } 
    this.unreadCounts[channel] = 0;
    this.storage.set( this.stalk.currentUser().id +"_"+ UNREAD_COUNT_KEY, JSON.stringify( this.unreadCounts ) );
  }

  public getUnreadCount(channel){
    if( !this.unreadCounts[channel] ){
      this.unreadCounts[channel] = 0;
    }
    return this.unreadCounts[channel];
  }

  public setLatestMessage(channel,msg){
    this.lastestMessages[channel] = msg;

    this.storage.set( this.stalk.currentUser().id +"_"+ LATEST_MESSAGE_KEY, JSON.stringify( this.lastestMessages ) );
  }

  public getLatestMessage(channel){
    return (this.lastestMessages[channel] || "");
  }

  loadUnreadCount(){
    var self = this;
    this.storage.get( this.stalk.currentUser().id +"_"+ UNREAD_COUNT_KEY ).then((val) => {
      if( val ){
        self.unreadCounts = JSON.parse( val );
      }
    });
  }

  loadLatestMessage(){
    var self = this;
    this.storage.get( this.stalk.currentUser().id +"_"+ LATEST_MESSAGE_KEY ).then((val) => {
      if( val ){
        self.lastestMessages = JSON.parse( val );
      }
    });
  }
}