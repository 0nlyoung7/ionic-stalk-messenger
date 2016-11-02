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

    this.ss.stalk.signUp(this.userId, this.password, function(err, user){

      if( err ){
        var message = err.message;
        let alert = self.alertCtrl.create({
          title: 'SignUp Failed',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
        return;     
      }
      
    });
  }
}