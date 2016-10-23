import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  constructor(public navCtrl: NavController) {

  }

  public messages = [
	{content: "Butter", type: "S", from:"from"},
	{content: "Milk"},
	{content: "Yogurt"},
	{content: "Cheese"},
  ];
}