(function(){

  var S5 = (function() {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     http = require('http');
     io = require('socket.io-client');
     Parse = require('parse');
    }

    var S5 = function(host, appId){
      var self = this;
      self.appId = appId;
      self.hostname = host;

      Parse.initialize(appId);
      Parse.serverURL = self.hostname+'/parse';

      return self;
    };

    S5.prototype.signUp = function(username, password, callback){

      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("nickName", username);

      user.signUp(null, {
        success: function(user) {
          callback( null, user );
        },
        error: function(user, error) {
          callback( error, null );
        }
      });
    };

    S5.prototype.logIn = function(username, password, callback){
      Parse.User.logIn(username, password, {
        success: function(user) {
          // Do stuff after successful login.
          callback( null, UTILS.fromParseObject(user) );
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          callback( error, null );
        }
      });
    };

    S5.prototype.logOut = function(){
      Parse.User.logOut();
    };

    var UTILS = {};

    UTILS.prototype.fromParseObject = function(user){

      var profileFileUrl = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileFileUrl = user.get('profileFile').url();
      }

      return {
        id: user.id,
        username: user.get('username'),
        email: user.get('email'),
        nickName: user.get('nickName'),
        profileFileUrl: profileFileUrl,
        statusMessage: user.get('statusMessage'),
      };  
    };

    return S5;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = S5;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return S5;
      });
    } else {
      window.S5 = S5;
    }
  }
})();