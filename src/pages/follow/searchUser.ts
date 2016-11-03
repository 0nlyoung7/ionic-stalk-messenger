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

    var data = {
      keyword: val,
      pageNumber: 1
    };

    if( this.timeout )clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){

      self.ss.stalk.searchUsersByPage( data, function( err, users ){
        self.users = users;
      });

    }, 200 );
  }

  addFollow = () => {
    var self = this;
    var keys = 0;

    for( var key in this.checkedList ){
      if( this.checkedList[key] ){
        this.ss.stalk.createFollow(key, function(err, result){
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