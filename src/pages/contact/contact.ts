import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

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
}