import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

import { NavController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chat',
  providers: [SharedService],
  templateUrl: 'chat.html'
})
export class ChatPage {

  inputMessage: any;
  messages:any[] = [];
  @ViewChild('fileInput') fileInput:ElementRef;

  constructor(private renderer: Renderer, public navCtrl: NavController, public ss: SharedService) {

    var self = this;
    ss.xpush.createSimpleChannel('channel01', function(){
      console.log( 'create simple channel success' );

      // Output the data to the screen that comes in `message` event.
      self.ss.xpush.on( 'message', function(channel, name, data){
        var msg = decodeURIComponent( data.MG );
        var type = data.TP ? data.TP : '';
        self.messages.push( {content:msg, sr:data.SR, type:type} );
      });
    });
  }

  public send = () => {
    var msg = encodeURIComponent( this.inputMessage );
    var data = { 'MG' : msg };
    this.ss.xpush.send('channel01', 'message', data );
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
      self.ss.xpush.send('channel01', 'message', data );
    });
  }
}