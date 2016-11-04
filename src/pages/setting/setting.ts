import { Component } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { SettingFormPage } from './settingForm';


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  user:any;

  constructor(public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.user = ss.stalk.currentUser;
  }

  public updateImage(){
    var imgBase64;
    this.ss.stalk.updateUser( "profileFile", imgBase64, function(err, user){

    });
  }

  public gotoSettingForm(settingKey,settingKeyNm){
    this.app.getRootNav().push(SettingFormPage, {"settingKey":settingKey,"settingKeyNm":settingKeyNm});
  }
}
