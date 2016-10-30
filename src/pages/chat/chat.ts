import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  channelId: string;
  inputMessage: any;
  messages:any[] = [];
  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService, private navParams: NavParams) {

    let users = navParams.get('users');

    var self = this;

    // Output the data to the screen that comes in `message` event.
    self.channelId = ss.xpush.generateChannelId( users );

    this.ss.xpush.on( 'message', function(channel, name, data){

      var msg = decodeURIComponent( data.MG );
      var type = data.TP ? data.TP : '';
      self.messages.push( {content:msg, sr:data.SR, type:type} );
    });
  }

  public send = () => {
    var msg = encodeURIComponent( this.inputMessage );
    var data = { 'MG' : msg };
    this.ss.xpush.send(this.channelId, 'message', data );
    this.inputMessage = '';
  }

  public selectFile = () => {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }

  public onFileChange = ($event, fileValue) => {
    var self = this;
    self.ss.xpush.uploadFileInBrowser('channel01', this.fileInput.nativeElement, function(result){
      var data = { 'MG' : result, TP : 'I' };
      self.ss.xpush.send(this.channelId, 'message', data );
    });
  }
}