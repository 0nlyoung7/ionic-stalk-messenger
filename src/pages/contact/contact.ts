import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  users:any[] = [];

  constructor(public navCtrl: NavController, public ss: SharedService) {
    var self = this;

    ss.xpush.listActiveUser( function( err, res, count){

      if( res.status == "ok"){
        self.users = res.result;
      } else {
        //callback( [] );
      }
    });
  }

  public gotoChat = (user) => {
    this.navCtrl.push(ChatPage, {users:[user.U]});
  }
}