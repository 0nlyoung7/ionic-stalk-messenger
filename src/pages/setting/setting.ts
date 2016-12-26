import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { ProfilePage } from './profile';


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  useNotification:boolean;
  settings:any;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.useNotification = ss.settings['notification'] ? ss.settings['notification'] : false;
  }

  public gotoProfile(){
    this.app.getRootNav().push(ProfilePage);
  }

  public logOut = () => {
    var self = this;
    this.ss.stalk.logOut();
    this.app.getRootNav().popToRoot();
  }

  public toggleNotification(){
    console.log( this.useNotification );
    this.ss.updateSetting( 'notification', this.useNotification );
  }
}
