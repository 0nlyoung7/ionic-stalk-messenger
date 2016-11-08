import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  username: string;
  password: string;

  // Alert 을 위한 alertCtrl 을 추가함
  constructor(public navCtrl: NavController, public ss: SharedService, public alertCtrl: AlertController) {
  }

  public signUp(){
    var self = this;
    this.ss.stalk.signUp(this.username, this.password, function(err, user){

      var title = 'Success';
      var subTitle = 'SignUp Success.';

      if( err ){
        title = 'Failed';
        subTitle = err.message;
      }

      let alert = self.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: ['OK']
      });
      alert.present();

      if( !err ){
        self.navCtrl.pop();
      }
    });
  }
}