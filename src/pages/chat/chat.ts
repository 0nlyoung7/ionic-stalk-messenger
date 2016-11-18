import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, App, NavParams, Content, MenuController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  inputMessage: any;
  messages:any[] = [];
  channel:any;
  users:any[];

  lastLoaded:number;

  @ViewChild(Content) content: Content;
  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private navParams: NavParams, public menuCtrl: MenuController, private app:App) {

    this.users = navParams.get('users');
    let channelId = navParams.get('channelId');

    var self = this;
    
    ss.stalk.openChannel( this.users, channelId, function( err, channel ){

      self.channel = channel;

      channel.loadMessages( function(err, messages ){
        self.messages = messages;
        self.scrollToBottom(messages.length * 20);

        if( messages.length > 0 ){
          self.lastLoaded = messages[0].createdAt;
        }
      });

      channel.onMessage( function(data){
        self.messages.push( data );
        self.scrollToBottom(100);
      });
    });
  }

  public send = () => {
    var msg = this.inputMessage;

    this.channel.sendText( msg );
    this.inputMessage = '';
  }

  public selectFile = function () {
    var event = new MouseEvent('click', { bubbles: true });
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
  };

  public onFileChange = function ($event, fileValue) {
    var self = this;
    self.channel.sendImageFile(self.fileInput.nativeElement, function (error, result) {
      console.log( result );
    });
  };

  scrollToBottom(delay){
    var self = this;
    setTimeout(function(){
      try {
        self.content.scrollToBottom(delay);
      } catch ( err ){
      }
    }, delay);
  }

  onScrollUp(infiniteHeader){
    var self = this;

    self.channel.loadMessages( function(err, messages){
      if( messages.length > 0 ){
        self.messages = messages.concat( self.messages );
      }

      if( messages.length == 50 ){
        infiniteHeader.complete();
      } else {
        infiniteHeader.enable(false);
      }
    }, self.lastLoaded );
  }

  public openMenu(){
    this.menuCtrl.toggle();
  }

  public goBack(){
    this.app.getRootNav().pop();
  }
}