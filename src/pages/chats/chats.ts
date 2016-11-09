import { Component } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {

  chats:any[] = [];

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App ) {
    var self = this;
    this.ss.stalk.loadChannels( function(err, chats){
      self.chats = chats;
    });
  }

  public gotoChat = (channel) => {
    this.app.getRootNav().push(ChatPage, {channelId:channel.channelId, users:channel.users});
  }
}