import { Component } from '@angular/core';

import { NavController, App , NavParams} from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-searchUser',
  templateUrl: 'searchUser.html'
})
export class SearchUserPage {

  searchQuery: string = '';
  users:any[] = [];

  timeout:any;
  checkedList: any = {};
  callback: any;
  btnNm: string;

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App, private navParams: NavParams) {
    this.callback = navParams.get('callback');
    this.btnNm = navParams.get('btnNm') ? navParams.get('btnNm') : "OK";
  }

  getItems(ev: any) {
    var self = this;

    // set val to the value of the searchbar
    let val = ev.target.value;

    if( this.timeout )clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){

      self.ss.stalk.searchUsers( val, function( err, users ){
        self.users = users;
      });

    }, 200 );
  }

  confirm = () => {
    var self = this;

    var checkUserIds = [];
    for( var userId in this.checkedList ){
      if( this.checkedList[userId] ){
        checkUserIds.push( userId );
      }
    }

    if( self.callback ){
      self.callback(checkUserIds);
    }
    self.navCtrl.pop();
  }
}