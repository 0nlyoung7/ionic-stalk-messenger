import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { SignInPage } from '../pages/account/signin';
import { SignUpPage } from '../pages/account/signup';

import { TabsPage } from '../pages/tabs/tabs';

import { FollowsPage } from '../pages/follows/follows';
import { SearchUserPage } from '../pages/follows/searchUser';

import { ChatsPage } from '../pages/chats/chats';
import { ChatPage } from '../pages/chat/chat';

import { SettingPage } from '../pages/setting/setting';
import { SettingFormPage } from '../pages/setting/settingForm';

//GlobalVariable
import {SharedService} from './sharedService';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage,
    TabsPage,
    FollowsPage,
    SearchUserPage,
    ChatsPage,
    ChatPage,
    SettingPage,
    SettingFormPage
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
    ChatsPage,
    ChatPage,
    SettingPage,
    SettingFormPage
  ],
  providers: [SharedService]
})
export class AppModule {}