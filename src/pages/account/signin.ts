import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignUpPage } from './signup';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SignInPage {

  private pushPage: any;

  constructor(public navCtrl: NavController) {
  	this.pushPage = SignUpPage;
  }

  public signIn(){
    this.navCtrl.push(TabsPage, {});
  }
}