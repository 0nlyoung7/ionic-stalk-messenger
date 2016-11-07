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
    this.ss.stalk.logIn(this.userId, this.password, function(err, user){
      if( err ){
        var message = err.message;
        let alert = self.alertCtrl.create({
          title: 'SignIn Failed',
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
        return;
      }
      self.navCtrl.push(TabsPage, {});
    });
  }
}