import { Injectable } from '@angular/core';

import {SharedService} from './sharedService';


@Injectable()
export class NotificationService {
  notificationsSupport:any;
  notificationsCnt:number = 0;
  public notificationsInx:number = 0;

  notificationsShown: any;

  notification:any ;
  mozNotification:any ;

  constructor(public ss: SharedService) {
    this.notificationsSupport = ('Notification' in window) || ('mozNotification' in navigator);
    this.notification = window["Notification"];
    this.mozNotification = window["mozNotification"];

    this.start();
  }

  public start = () => {

    if (!this.notificationsSupport) {
      return false;
    }

    if ( this.notification && this.notification.permission !== 'granted' && this.notification.permission !== 'denied') {
      window.addEventListener("click", this.requestPermission );
    }

    try {
      window.addEventListener("beforeunload", this.clearNotification );
    } catch (e) {}
  }

  public notify = (data) => {
    var usePreview = this.ss.settings['preview'] || true;
    if( !usePreview ){
      return;
    }

    this.notificationsCnt++;

    if (!this.notificationsSupport ||
        'Notification' in window && this.notification.permission !== 'granted') {
      return false;
    }

    var message = data.message;
    var idx = ++this.notificationsInx;
    var channelId = data.channelId;
    var noti;

    if ('Notification' in window) {
      noti = new this.notification(data.name, {
        icon: data.avatar, body: message
      });
    } else if ('mozNotification' in navigator) {
      noti = this.mozNotification.createNotification(data.name, message, data.avatar);
    } else {
      return;
    }

    if (noti.show) {
      noti.show();
    }

    if( this.ss.settings['useSound'] ){
      this.playSound();
    }

    // Auto close after 15s
    setTimeout( function(){
      noti.close();      
    }, 5000 );
  }

  public requestPermission = () => {
    var self = this;
    this.notification.requestPermission(function (permission) {
      if(!('permission' in self.notification)) {
        self.notification.permission = permission;
      }
    });
    window.removeEventListener("click", self.requestPermission );
  }

  public clearNotification = () => {
    this.notificationsShown = {};
    this.notificationsCnt = 0;
  }

  public playSound = () => {
    var audio = new Audio('job-done.ogg');
    audio.play();
  }
}