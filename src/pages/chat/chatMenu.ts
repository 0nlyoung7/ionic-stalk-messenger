import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, NavParams, Content, MenuController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ChatPage } from './chat'

import { SearchFollowPage } from '../follows/searchFollow';

@Component({
  selector: 'page-chat',
  templateUrl: 'chatMenu.html'
})
export class ChatMenuPage {
  user:any;
  rootPage: any;
  rootParams: any;

  users:any[];
  channelId: string;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private navParams: NavParams, public ss: SharedService, private app:App ) {
    this.user = ss.stalk.currentUser();

    console.log( this.user );

    this.users = navParams.get('users');
    this.channelId = navParams.get('channelId');

    this.rootPage = ChatPage;
    this.rootParams = navParams;
  }

  public inviteUser = (userIds) => {
    var self = this;
    this.ss.stalk.currentChannel().addUserToChat( userIds, function( err, result ){
      self.users = result.users;

      if( self.channelId != result.channelId){
        self.channelId = result.channelId;
        self.rootParams = {users:self.users,channelId:result.channelId};
        self.menuCtrl.close();
        self.app.getRootNav().push( ChatMenuPage, {users:self.users,channelId:result.channelId} ).then(() => {
          const index = self.app.getRootNav().getActive().index;
          self.app.getRootNav().remove(index-1);
        });
      }

      self.menuCtrl.close();
    });
  };

  public openSearchUser = () => {
    this.navCtrl.push(SearchFollowPage, {callback:this.inviteUser, btnNm:"Invite", users:this.users});
  }

  public leaveChat = () => {
    this.ss.stalk.currentChannel().leaveChat( function(err, result){
      console.log( result );
    });
  }
}
