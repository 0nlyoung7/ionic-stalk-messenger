import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignUpPage } from './signup';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SignInPage {

  userId: any;
  password: any;

  private pushPage: any;

  constructor(public navCtrl: NavController, public ss: SharedService, public alertCtrl: AlertController) {
    this.pushPage = SignUpPage;
  }

  public signIn(){
    var self = this;

    this.ss.xpush.login(this.userId, this.password, function(err, result){
      console.log( result );

      if( !err ){
        self.navCtrl.push(TabsPage, {});
      } else {
        var message = "The userId or password is incorrect.";
        var status = result.status;
        let alert = self.alertCtrl.create({
          title: 'SignIn Failed',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      }
    });
    
  }
}