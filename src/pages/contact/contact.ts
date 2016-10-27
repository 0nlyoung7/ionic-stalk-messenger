import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  users:any[] = [];

  constructor(public navCtrl: NavController) {
  	this.users = [
  		{"name":"Woody", "message":"This town ain't big enough for the two of us!", "image" :"http://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-woody.png"},
  		{"name":"Buzz Lightyear", "message":"My eyeballs could have been sucked from their sockets!", "image" :"http://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-buzz.png"},
  		{"name":"Jessie", "message":"Well aren't you just the sweetest space toy I ever did meet!", "image" :"http://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-jessie.png"},
  		{"name":"Mr. Potato Head", "message":"You're not turning me into a Mashed Potato.", "image" :"http://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-potatohead.png"}
  	];
  }

}
