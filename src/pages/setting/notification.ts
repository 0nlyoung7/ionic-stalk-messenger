import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  useNotification:boolean;
  settings:any;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.useNotification = ss.settings['notification'] ? ss.settings['notification'] : false;
  }

  public toggleNotification(){
    this.ss.updateSetting( 'notification', this.useNotification );
  }
}
