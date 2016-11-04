import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  channelId: string;
  inputMessage: any;
  messages:any[] = [];
  chat:any;

  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private navParams: NavParams) {

    let paramChat = navParams.get('paramChat');

    var self = this;

    ss.stalk.openChat( paramChat, function( err, chat ){

      self.channelId = chat.channelId;
      self.chat = chat;

      chat.loadMessages( function(err, messages ){
        self.messages = messages;
      });

      chat.onMessage( function(data){
        self.messages.push( data );
      });
    });
  }

  public send = () => {
    var msg = this.inputMessage;

    this.chat.sendText( msg );
    this.inputMessage = '';
  }
}