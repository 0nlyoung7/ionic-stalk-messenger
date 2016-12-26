import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { SignInPage } from '../pages/account/signin';
import { SignUpPage } from '../pages/account/signup';

import { TabsPage } from '../pages/tabs/tabs';

import { FollowsPage } from '../pages/follows/follows';
import { SearchUserPage } from '../pages/follows/searchUser';
import { SearchFollowPage } from '../pages/follows/searchFollow';

import { ChannelsPage } from '../pages/channels/channels';
import { ChatPage } from '../pages/chat/chat';
import { ChatMenuPage } from '../pages/chat/chatMenu';

import { SettingPage } from '../pages/setting/setting';
import { SettingFormPage } from '../pages/setting/settingForm';
import { ProfilePage } from '../pages/setting/profile';

//GlobalVariable
import {SharedService} from './sharedService';

import {InfiniteHeader} from '../directives/infiniteHeader';

import {NotificationService} from './notificationService';

import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage,
    TabsPage,
    FollowsPage,
    SearchUserPage,
    SearchFollowPage,
    ChannelsPage,
    ChatPage,
    SettingPage,
    SettingFormPage,
    ProfilePage,
    InfiniteHeader,
    ChatMenuPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    TabsPage,
    FollowsPage,
    SearchUserPage,
    SearchFollowPage,
    ChannelsPage,
    ChatPage,
    SettingPage,
    SettingFormPage,
    ProfilePage,
    ChatMenuPage
  ],
  providers: [SharedService, NotificationService, Storage]
})
export class AppModule {}