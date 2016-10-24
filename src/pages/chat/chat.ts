import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {SharedService} from '../../app/sharedService';

@Component({
  selector: 'page-chat',
  providers: [SharedService],
  templateUrl: 'chat.html'
})
export class ChatPage {

  inputMessage: any;

  constructor(public navCtrl: NavController, public ss: SharedService) {

    var self = this;
    ss.xpush.createSimpleChannel('channel01', function(){
      console.log( 'create simple channel success' );

      // Output the data to the screen that comes in `message` event.
      console.log( ss.xpush );
      console.log( self.ss.xpush );
    });

    self.ss.xpush.on( 'message', function(channel, name, data){
      console.log( channel, name, data );
    });
  }

  public send = () => {
    this.ss.xpush.send('channel01', 'message', this.inputMessage );
    this.inputMessage = '';
  }

  public messages = [
  	{content: "Butter", type: "S", from:"from"},
  	{content: "Milk"},
  	{content: "Yogurt"},
  	{content: "Cheese"},
  ];
}