import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-settingForm',
  templateUrl: 'settingForm.html'
})
export class SettingFormPage {

  settingValue:string;
  settingKey:string;
  settingKeyNm:string;

  constructor(public navCtrl: NavController, public ss: SharedService, private navParams: NavParams ) {

    this.settingKey = navParams.get('settingKey');
    this.settingKeyNm = navParams.get('settingKeyNm');

    this.settingValue = ss.stalk.currentUser[this.settingKey];
  }

  public updateUser(){
    var self = this;
    self.ss.stalk.updateUser( self.settingKey, self.settingValue, function(err, user){
      if( err ){
        return;
      }
      self.navCtrl.pop();
    });
  }

  public clearValue(){
    this.settingValue = "";
  }
}
