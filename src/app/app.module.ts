import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ChatPage } from '../pages/chat/chat';
import { TabsPage } from '../pages/tabs/tabs';

import { FollowPage } from '../pages/follow/follow';
import { SearchUserPage } from '../pages/follow/searchUser';

import { SignInPage } from '../pages/account/signin';
import { SignUpPage } from '../pages/account/signup';

//GlobalVariable
import {SharedService} from './sharedService';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ChatPage,
    SignInPage,
    SignUpPage,
    FollowPage,
    SearchUserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ChatPage,
    SignInPage,
    SignUpPage,
    FollowPage,
    SearchUserPage
  ],
  providers: [SharedService]
})
export class AppModule {}
