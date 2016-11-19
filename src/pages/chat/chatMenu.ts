import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, NavParams, Content, MenuController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ChatPage } from './chat'

import { SearchUserPage } from '../follows/searchUser';

@Component({
  selector: 'page-chatMenu',
  templateUrl: 'chatMenu.html'
})
export class ChatMenuPage {

  rootPage: any;
  rootParams: any;

  users:any[];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private navParams: NavParams) {

    this.users = navParams.get('users');

    this.rootPage = ChatPage;
    this.rootParams = navParams;
  }

  public inviteUser = (userIds) => {
    var self = this;
  };

  public openSearchUser = () => {
    this.navCtrl.push(SearchUserPage, {callback:this.inviteUser, btnNm:"Invie", users:this.users});
  }
}