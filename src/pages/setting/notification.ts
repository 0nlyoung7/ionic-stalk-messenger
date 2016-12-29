import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  usePreview:boolean;
  useSound:boolean;

  settings:any;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.usePreview = ss.settings['usePreview'] ? ss.settings['usePreview'] : false;
    this.useSound = ss.settings['useSound'] ? ss.settings['useSound'] : false;
  }

  public togglePreview(){
    this.ss.updateSetting( 'usePreview', this.usePreview );
  }

  public toggleSound(){
    this.ss.updateSetting( 'useSound', this.useSound );
  }
}
