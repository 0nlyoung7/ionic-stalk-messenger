import { Component } from '@angular/core';

import { Events } from 'ionic-angular';

import { FollowsPage } from '../follows/follows';
import { ChannelsPage } from '../channels/channels';
import { SettingPage } from '../setting/setting';

import {SharedService} from '../../app/sharedService';
import {NotificationService} from '../../app/notificationService';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = FollowsPage;
  tab2Root: any = ChannelsPage;
  tab3Root: any = SettingPage;

  badgeCnt:number = 0;

  constructor( public ss: SharedService, public ns: NotificationService, public events: Events ) {
    var self = this;
    ss.stalk.onGlobalMessage(function(data){

      var msg = data.text;
      if( data.image ) {
        msg = '@Image';
      } else {
        msg = data.text;
      }

      var message = { channelId: data.C, message: msg, 'name': undefined, 'avatar' : undefined };
      if( data.user && data.user.avatar ){
        message.avatar = data.user.avatar;
      }

      if( data.name ){
        message.name = data.name;
      } else if( message.avatar ) {
        message.name = data.user.nickName;
      }

      ss.plusUnreadCount( data.C, 1 );
      
      ns.notify( message );

      self.badgeCnt = ns.notificationsCnt;
    });

    events.subscribe('message:unread', (userEventData) => {
      self.badgeCnt = ns.notificationsCnt;
    });
  }
}