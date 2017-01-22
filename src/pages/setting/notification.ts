import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-setting',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  user:any;
  usePreview:boolean;
  useImagePreview:boolean;
  settings:any;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private app:App) {
    this.user = ss.stalk.currentUser();
    
    this.usePreview = ss.settings['preview'] ? ss.settings['preview'] : false;
    this.useImagePreview = ss.settings['imagePreview'] ? ss.settings['imagePreview'] : false;
  }

  public togglePreview =()=> {
    this.ss.updateSetting( 'preview', this.usePreview );
  }

  public toggleImagePreview =()=> {
    this.ss.updateSetting( 'imagePreview', this.useImagePreview );
  }
}
