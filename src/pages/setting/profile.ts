import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

import { SettingFormPage } from './settingForm';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user:any;
  useNotification:boolean;
  settings:any;

  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.user = ss.stalk.currentUser();

    this.useNotification = ss.settings['notification'] ? ss.settings['notification'] : false;
  }

  public gotoSettingForm(propKey,propKeyNm){
    this.app.getRootNav().push(SettingFormPage, {"propKey":propKey,"propKeyNm":propKeyNm});
  }

  public selectFile = () => {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }

  public onFileChange = ($event, fileValue) => {
    var self = this;

    this.ss.stalk.updateUser( "profileFile", self.fileInput.nativeElement, function(err, user){
      console.log( user );
    });
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
