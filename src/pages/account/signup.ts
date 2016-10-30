import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  userId: any;
  password: any;

  // Alert 을 위한 alertCtrl 을 추가함
  constructor(public ss: SharedService, public alertCtrl: AlertController) {
  }

  public signUp(){
    var self = this;
    this.ss.xpush.signup(this.userId, this.password, function(err, result){
      console.log( result );
      var message = "";
      var status = result.status;
      if( "ok" == result.status ){
        message = "Success";
      } else {
        message = "User alreay exists.";
      }

      let alert = self.alertCtrl.create({
        title: status,
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
    });
  }
}