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
        var msg = decodeURIComponent( data );
        self.messages.push( {content:msg} );
      });
    });
  }

  public send = () => {
    var msg = encodeURIComponent( this.inputMessage );
    this.ss.xpush.send('channel01', 'message', msg );
    this.inputMessage = '';
  }

  public selectFile = () => {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }
}