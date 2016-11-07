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

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App, private navParams: NavParams) {
    this.callback = navParams.get('callback');
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

  addFollow = () => {
    var self = this;

    for( var userId in this.checkedList ){
      if( this.checkedList[userId] ){
        this.ss.stalk.createFollow(userId, function(err, result){
          if( err ){
            alert(err.message);
            return;
          }

          if( self.callback ){
            self.callback();
          }
          self.navCtrl.pop();
        });
      }

      break;
    }
  }
}