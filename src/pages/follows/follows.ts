import { Component } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ChatMenuPage } from '../chat/chatMenu';
import { SearchUserPage } from './searchUser';

@Component({
  selector: 'page-follows',
  templateUrl: 'follows.html'
})
export class FollowsPage {

  users:any[] = [];

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App) {
    var self = this;
    this.ss.stalk.loadFollows( function(err, users){
      self.users = users;
    });
  }

  public gotoChat = (user) => {
    this.app.getRootNav().push(ChatMenuPage, {users:[user]});
  }

  public openSearchUser = () => {
    this.app.getRootNav().push(SearchUserPage, {callback:this.addFollow, btnNm:"Add"});
  }

  public addFollow = (userIds) => {
    var self = this;

    this.ss.stalk.createFollow(userIds, function(err, result){
      if( err ){
        alert(err.message);
        return;
      }

      self.ss.stalk.loadFollows( function(err, results){
        self.users = results;
      });
    });
  };

  removeFollow = (user, inx) => {
    var self = this;
    this.ss.stalk.removeFollow(user.id,function(err, result){
      if( err ){
        alert( err.message );
        return;
      }
      self.users.splice(inx, 1);
    });
  }
}