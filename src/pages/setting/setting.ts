import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { SettingFormPage } from './settingForm';
import { ProfilePage } from './profile';
import { NotificationPage } from './notification';


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  useNotification:boolean;
  settings:any;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
  }

  public gotoProfile(){
    this.app.getRootNav().push(ProfilePage);
  }

  public gotoNotification(){
    this.app.getRootNav().push(NotificationPage);
  }

  public logOut = () => {
    var self = this;
    this.ss.stalk.logOut();
    this.app.getRootNav().popToRoot();
  }
}
