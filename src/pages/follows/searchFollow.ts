import { Component } from '@angular/core';

import { NavController, App , NavParams} from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-searchFollow',
  templateUrl: 'searchFollow.html'
})
export class SearchFollowPage {

  searchQuery: string = '';
  follows:any[] = [];

  timeout:any;
  checkedList: any = {};
  diabledList: any = {};
  callback: any;
  btnNm: string;

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App, private navParams: NavParams) {

    var self = this;
    this.callback = navParams.get('callback');
    this.btnNm = navParams.get('btnNm') ? navParams.get('btnNm') : "OK";

    let existUsers = navParams.get('users');

    if( existUsers && existUsers.length > 0 ){
      for ( var inx in existUsers ){
        var id = existUsers[inx].id;
        self.diabledList[id] = true;
      }
    }

    ss.stalk.loadFollows( function( err, results ){
      self.follows = results;
    });
  }

  getItems(ev: any) {
    var self = this;

    // set val to the value of the searchbar
    let val = ev.target.value;

    if( this.timeout )clearTimeout(this.timeout);
    this.timeout = setTimeout(function(){
      self.follows = self.follows.filter((follow) => {
        return (follow.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
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