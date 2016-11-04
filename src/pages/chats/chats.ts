import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html'
})
export class ChatsPage {

  chats:any[] = [];

  constructor(public navCtrl: NavController, public ss: SharedService ) {
    var self = this;

    this.ss.stalk.loadChats( function(err, chats){
      self.chats = chats;

      console.log( chats );
    });
  }
}