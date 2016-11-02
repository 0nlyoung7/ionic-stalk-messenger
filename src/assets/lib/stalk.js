(function(){

  var DEFAULT_PAGE_SIZE = 50;

  var Stalk = (function() {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     http = require('http');
     io = require('socket.io-client');
     Parse = require('parse');
    }

    var Stalk = function(host, appId){
      var self = this;
      self.appId = appId;
      self.hostname = host;

      Parse.initialize(appId);
      Parse.serverURL = self.hostname+'/parse';

      return self;
    };

    Stalk.prototype.signUp = function(username, password, callback){

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

    Stalk.prototype.logIn = function(username, password, callback){
      Parse.User.logIn(username, password, {
        success: function(user) {
          // Do stuff after successful login.
          callback( null, UTILS.fromUserToJSON(user) );
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          callback( error, null );
        }
      });
    };

    Stalk.prototype.loadFollows = function(callback){
      var currentUser = Parse.User.current();
      var Follows = Parse.Object.extend('Follows');

      var query = new Parse.Query(Follows)
        .equalTo('userFrom', currentUser)
        .include('userTo')
        .ascending('nickName');

      query.find({
        success:function(results) {
          callback( null, results.map(UTILS.fromFollowToJSON) )
        },
        error: function(error) {
          callback( error, null );
        }
      });
    };

    Stalk.prototype.logOut = function(){
      Parse.User.logOut();
    };

    Stalk.prototype.searchUsersByPage = function(data, callback){
      var limit = data.pageSize || DEFAULT_PAGE_SIZE;
      var skip = ((data.pageNumber || 1) - 1) * limit;

      if(data.keyword) {
        var usernameQuery = new Parse.Query(Parse.User);
        usernameQuery.startsWith("username", data.keyword);

        var nickNameQuery = new Parse.Query(Parse.User);
        nickNameQuery.startsWith("nickName", data.keyword);

        var query = Parse.Query.or(usernameQuery, nickNameQuery);

        if(skip > 0) query = query.skip(skip);
        query = query.limit(limit).ascending('username');

        query.find({
          success:function(results) {
            callback( null, results.map(UTILS.fromUserToJSON) )
          },
          error: function(error) {
            callback( error, null );
          }
        });
      } else{
        callback(null, []);
      }      
    };

    Stalk.prototype.createFollow = function(id, callback){
      Parse.Cloud.run('follows-create', {id:id}, {
        success:function(result) {
          callback( null, result )
        },
        error: function(error) {
          callback( error, null );
        }
      });
    };

    Stalk.prototype.removeFollow = function(id, callback){
      Parse.Cloud.run('follows-remove', {id:id}, {
        success:function(result) {
          callback( null, result )
        },
        error: function(error) {
          callback( error, null );
        }
      });      
    };

    var UTILS = {};

    UTILS.fromUserToJSON = function(user){

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

    UTILS.fromFollowToJSON = function(object){
      var user = object.get('userTo');
      var profileFileUrl = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileFileUrl = user.get('profileFile').url();
      }

      var result = {
        followId: object.id,
        id: user.id,
        username: user.get('username'),
        email: user.get('email'),
        nickName: user.get('nickName'),
        statusMessage: user.get('statusMessage'),
        profileFileUrl: profileFileUrl,
      };

      return result;
    }

    return Stalk;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Stalk;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Stalk;
      });
    } else {
      window.Stalk = Stalk;
    }
  }
})();