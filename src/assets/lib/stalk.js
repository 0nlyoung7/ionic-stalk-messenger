(function(){

  var DEFAULT_PAGE_SIZE = 50;
  var MESSAGE_SIZE = 30;

  var Stalk = (function() {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
     http = require('http');
     io = require('socket.io-client');
     Parse = require('parse');
    }

    var socketOptions ={
      transports: ['websocket']
      ,'force new connection': true
    };

    var GLOBAL = 'global';
    var CHANNEL = 'channel';

    var debug = function() {
    };

    var Stalk = function(host, appId){
      var self = this;
      self.appId = appId;
      self.hostname = host;
      self.chats = {};
      self.currentUser = {};

      Parse.initialize(appId);
      Parse.serverURL = self.hostname+'/parse';

      return self;
    };

    /**
     * debug 기능을 켠다.
     * @name enableDebug
     * @memberof Xpush
     * @function
     * @example
     * // enable debug
     * xpush.enableDebug();
     */
    Stalk.prototype.enableDebug = function(){
      if( oldDebug ){
        return;
      }

      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        debug = Function.prototype.bind.call(console.log, console);
      } else {
        if (window.console) {
          if (Function.prototype.bind) {
            debug = Function.prototype.bind.call(console.log, console);
          } else {
            debug = function() {
              Function.prototype.apply.call(console.log, console, arguments);
            };
          }
        }
      }
    };

    /**
     * debug 기능을 끈다.
     * @name disableDebug
     * @memberof Xpush
     * @function
     * @example
     * // disable debug
     * xpush.disableDebug();
     */
    Stalk.prototype.disableDebug = function(){
      // Init debug funciton
      debug = function(){
      };

      oldDebug = undefined;
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
      var self = this;
      Parse.User.logIn(username, password, {
        success: function(user) {
          // Do stuff after successful login.
          var jsonUser = ParseUtil.fromUserToJSON(user);
          self.currentUser = jsonUser;

          // profile size 가공 
          self.currentUser.profileFileUrl = Util.getDefaultProfile( jsonUser.username, 160 );
          callback( null, ParseUtil.fromUserToJSON(user) );
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          callback( error, null );
        }
      });
    };

    Stalk.prototype.logOut = function(){
      Parse.User.logOut();
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
          callback( null, results.map(ParseUtil.fromFollowToJSON) )
        },
        error: function(object, error) {
          callback( error, null );
        }
      });
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
            callback( null, results.map(ParseUtil.fromUserToJSON) )
          },
          error: function(object, error) {
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
        error: function(object, error) {
          callback( error, null );
        }
      });
    };

    Stalk.prototype.removeFollow = function(id, callback){
      Parse.Cloud.run('follows-remove', {id:id}, {
        success:function(result) {
          callback( null, result )
        },
        error: function(object, error) {
          callback( error, null );
        }
      });      
    };

    Stalk.prototype.openChat = function(data, callback){
      var self = this;

      if( data.id && self.chats[data.id] ){
        callback( null, self.chats[data.id] );
        return;
      }

      self.createChat(data.users, callback);
    };

    Stalk.prototype.createChat = function(users, callback){

      var self = this;
      var ids = [];
      users.forEach( function(user) {
         ids.push(user.id);
      });

      Parse.Cloud.run('chats-create', { ids: ids }, {
        success:function(result) {

          self.getChatById( result.id, function( err, chat ){
            callback( null, chat );
          });
        },
        error: function(object, error) {
          callback( error, null );
        }
      });
    };

    Stalk.prototype.getChatById = function(chatId, callback){
      var self = this;

      if( self.chats[chatId] ){
        callback( null, self.chats[chatId] );
        return;
      }

      var Chats = Parse.Object.extend('Chats');

      var query = new Parse.Query(Chats)
      .include('channel.users')
      .get(chatId, {
        success:function(chat) {

          var newChat = new Chat(self, ParseUtil.fromChatToJSON(chat) );
          self.chats[newChat.id] = newChat;
          callback( null, newChat  );
        },
        error: function(object, error) {
          callback( error, null );
        }
      });
    };

    Stalk.prototype.loadChats = function(callback){
      var currentUser = Parse.User.current();

      var self = this;
      var Chats = Parse.Object.extend('Chats');

      var query = new Parse.Query(Chats)
        .equalTo('user', currentUser)
        .include('channel.users')
        .descending("updatedAt");

      query.find({
        success:function(lists) {
          var chats = lists.map( ParseUtil.fromChatToJSON );
          callback( null, chats );
        },
        error: function(object, error) {
          callback( error, null );
        }
      }); 
    };

    var Chat = function(stalk, data){
      var self = this;
      self._stalk = stalk;

      self.id = data.id;
      self.channelId = data.channelId;
      self.createdAt = data.createdAt;
      self.updatedAt = data.updatedAt;
      self.name = data.name;
      self.uid = data.uid;
      self.users = data.users;

      self.currentUser;

      // channel connection;
      self._socket;

      self.onMessageCallback;

      return self;
    };

    Chat.prototype._getSocket = function(callback){
      var self = this;
      self.currentUser = Parse.User.current();

      if( self._socket && self._socket.connected ){
        if( callback ) callback(self._socket);
      } else {
        self._getChannelNode( function(err, node){
          if( !err ){
            self.connectChannel(node, callback);
          }
        });
      }
    };

    Chat.prototype._getChannelNode = function(callback){
      var self = this;
      this._stalk.ajax( '/node/'+self.appId+'/'+encodeURIComponent(self.channelId) , 'GET', {}, function(err, data){
        if( err ){
          callback( err, null);
        } else if ( data.status == 'ok'){

          var result = {
            app: self.appId,
            name: data.result.server.name,
            url: data.result.server.url
          };

          callback( null, result );
        }
      }); 
    };

    Chat.prototype.connectChannel = function(node, callback){
      var self = this;
      var userId = self.currentUser ? self.currentUser.id : "someone";

      var self = this;
      var query =
          'A='+self._stalk.appId+'&'+
          'C='+self.channelId+'&'+
          'U='+userId+'&'+
          'S='+node.name;

      self._socket = io.connect(node.url+'/channel?'+query, socketOptions);

      self._socket.on('connect', function(){
        debug( 'channel connection completed' );
        self._connected = true;
        if(callback) callback(self._socket);
      });

      self._socket.on('disconnect', function(){
        self._connected = false;
      });

      self._socket.on('message', function(data){

        if( self.onMessageCallback ){

          if( typeof(data) == 'object' && data.user ) {
            if( data.user._id == self.currentUser.id ){
              data.sent = true;
            }
          }

          self.onMessageCallback( data );
        }
      });
    };

    var messageTimeSort = function(a,b){
      // created data
      return a.createdAt > b.createdAt;
    };

    Chat.prototype.loadMessages = function(callback, datetime){

      var self = this;
      var Messages = Parse.Object.extend('Messages');
      var Channels = Parse.Object.extend('Channels');

      var channel = new Channels();
      channel.id = self.channelId;

      // init channel socket;
      self._getSocket( function( socket ){
      });

      var query = new Parse.Query(Messages)
        .equalTo("channel", channel)
        .lessThan("createdAt", datetime ? new Date(datetime) : new Date())
        .greaterThan("createdAt", new Date(self.createdAt))
        .descending("createdAt")
        .include("user") // TODO check performance issues ?
        .limit(MESSAGE_SIZE)
        .find({
          success:function(lists) {

            var messages = lists.map( ParseUtil.fromMessageToJSON );
            callback( null, messages.sort(messageTimeSort) );
          },
          error: function(object, error) {
            callback( error, null );
          }
        });
    }; 

    Chat.prototype.sendText = function(message){
      var self = this;

      var currentUser = Parse.User.current();

      var data = { 
        text: message,
        user: { _id: currentUser.id, name: currentUser.username, avatar: currentUser.profileFileUrl },
        _id: 'temp-id-' + self.channel + Math.round(Math.random() * 1000000)
      };

      self._getSocket( function( socket ){
        socket.emit('send', {NM: 'message' , DT: data});
      });
    };

    Chat.prototype.onMessage = function(callback){
      this.onMessageCallback = callback;
    };

    Chat.prototype.sendImage = function(message){
      var self = this;
      var data = { image: message,
        createdAt: Date.now(),
        _id: 'temp-id-' + self.channel + Math.round(Math.random() * 1000000)
      }
    };

    var ParseUtil = {};

    ParseUtil.fromUserToJSON = function(user){

      var username = user.get('username');

      var profileFileUrl = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileFileUrl = user.get('profileFile').url();
      } else {
        profileFileUrl = Util.getDefaultProfile( username ); 
      }

      return {
        id: user.id,
        username: username,
        email: user.get('email'),
        nickName: user.get('nickName'),
        profileFileUrl: profileFileUrl,
        statusMessage: user.get('statusMessage'),
      };  
    };

    ParseUtil.fromFollowToJSON = function(object){
      var user = object.get('userTo');
      var username = user.get('username');

      var profileFileUrl = "";
      if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
        profileFileUrl = user.get('profileFile').url();
      } else {
        profileFileUrl = Util.getDefaultProfile( username );   
      }

      var result = {
        followId: object.id,
        id: user.id,
        username: username,
        email: user.get('email'),
        nickName: user.get('nickName'),
        statusMessage: user.get('statusMessage'),
        profileFileUrl: profileFileUrl,
      };

      return result;
    };

    ParseUtil.fromChatToJSON = function(object){

      if( !object ){
        return null;
      }

      var channel = object.get("channel");
      var users = channel.get("users");
      var names = [];

      var currentUser = Parse.User.current();
      users.reduceRight(function(acc, user, index, object) {
        if (user.id === currentUser.id) {
          object.splice(index, 1);
        } else {

          object[index] = ParseUtil.fromUserToJSON(user);
          names.push(user.get('nickName'));
        }
      }, []);

      var name = names.join(", ");
      var image = Util.getDefaultProfile( name );

      return {
        id: object.id,
        channelId: channel.id,
        createdAt: Util.dateToString(object.get("createdAt")),
        updatedAt: Util.dateToString(object.get("updatedAt")),
        name: names.join(", "),
        uid: users.length == 1 ? users[0].id : null, // uid 이 Null 이면, Group Chat !
        users: users,
        image: image
      };
    };

    ParseUtil.fromMessageToJSON = function(object){
      var user = object.get("user");
      var profileFileUrl = user.get('profileFile') ? user.get('profileFile').url() : null;

      var currentUser = Parse.User.current();

      return {
        _id: object.id,
        text: object.get("message"),
        createdAt: object.createdAt,
        user: {
          _id: user.id,
          username: user.get('username'),
          name: user.get('nickName'),
          avatar: profileFileUrl
        },
        sent: user.id == currentUser.id,
        image: object.get("image")
      };
    };

    var Util= {};

    Util.getDefaultProfile = function(str, size){
      var result = "https://cdn-enterprise.discourse.org/ionicframework/user_avatar/forum.ionicframework.com/dtrujo/90/12150_1.png";

      if (str.search(/[^a-zA-Z]+/) === -1) {

        var firstChar = str.substring(0,1);
        var rgb = Util.getRGBFromStr(str);
        if( !size ){
          size = 50;
        }

        result = "https://avatars.discourse.org/v2/letter/"+firstChar+"/"+rgb+"/"+size+".png";
      }

      return result;
    }

    Util.getRGBFromStr = function( str ){
      return Util.intToRGB(Util.hashCode(str));
    };

    Util.hashCode = function(str) { // java String#hashCode
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };

    Util.intToRGB = function(i){
      var c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();

      return "00000".substring(0, 6 - c.length) + c;
    };

    Util.dateToString =function(paramDate, type){

      var cDate = new Date();

      var cYyyymmdd = cDate.getFullYear() + "" + (cDate.getMonth() + 1) + "" + cDate.getDate();
      var date = new Date(paramDate);

      var yyyy = date.getFullYear();
      var mm = date.getMonth() + 1;
      mm = mm >= 10 ? "" + mm : "0" + mm;

      var dd = date.getDate();
      dd = dd >= 10 ? "" + dd : "0" + dd;

      var hour = date.getHours();
      hour = hour >= 10 ? hour : "0" + hour;

      var minute = date.getMinutes();
      minute = minute >= 10 ? "" + minute : "0" + minute;

      var second = date.getSeconds();
      second = second >= 10 ? "" + second : "0" + second;

      var yyyymmdd = yyyy + "" + mm + "" + dd;

      var result = [];
      if (cYyyymmdd != yyyymmdd) {
        result.push(yyyy + "-" + mm + "-" + dd);
      } else {
        result.push(hour + ":" + minute + ":" + second);
      }

      result.push(yyyy + "-" + mm + "-" + dd);
      result.push(hour + ":" + minute + ":" + second);
      result.push(date.toLocaleTimeString());

      if( type == undefined ){
        type = 0;
      }

      return result[type];  
    };

    var _rest = function( context, method, data, headers, cb){
      var self = this;

      if(typeof(headers) == 'function' && !cb){
        cb = headers;
        headers = undefined;
      }

      var hostname = self.hostname.replace( "http://", "" );
      var port = 8000;
      if( hostname.indexOf( ":" ) > 0 ) {
        hostname = hostname.split(":")[0];
        port = hostname.split(":")[1]
      }

      var options = {
        host: hostname,
        port:port,
        path: context,
        method: method
      };

      if( headers ){
        options.headers = headers;
      } else {
         options.headers = {};
      }

      options.headers['Content-Type'] = 'application/json';      

      var result = '';
      var request = http.request( options, function(res) {

        res.setEncoding('utf8');
        res.on("data", function(chunk) {    
          result = result + chunk;      
        });

        res.on("end", function() {
          var r = JSON.parse(result);
          if(r.status != 'ok'){
            cb(r.status,r.message);
          }else{
            cb(null,r);
          }  
        });

      }).on('error', function(e) {
        debug("ajax error: " + e.message);
        cb('',result);
      });
      
      if( method.toLowerCase() !== 'GET'.toLowerCase() ){
        request.write(JSON.stringify(data));
      }
      request.end();
    }

    var _ajax = function( context, method, data, headers, cb){
      var self = this;

      if(typeof(headers) == 'function' && !cb){
        cb = headers;
        headers = false;
      }

      var xhr;
      try{
        xhr = new XMLHttpRequest();
      }catch (e){
        try{
          xhr = new XDomainRequest();
        } catch (e){
          try{
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
          }catch (e){
            try{
              xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }catch (e){
              console.error('\nYour browser is not compatible with XPUSH AJAX');
            }
          }
        }
      }

      var _url = self.hostname+context;

      var param = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');

      method = (method.toLowerCase() == "get") ? "GET":"POST";
      param  = (param == null || param == "") ? null : param;
      if(method == "GET" && param != null){
        _url = _url + "?" + param;
      }

      xhr.open(method, _url, true);
      xhr.onreadystatechange = function() {

        if(xhr.readyState < 4) {
          return;
        }

        if(xhr.status !== 200) {
          debug("xpush : ajax error", self.hostname+context,param);
          cb(xhr.status,{});
        }

        if(xhr.readyState === 4) {
          var r = JSON.parse(xhr.responseText);
          if(r.status != 'ok'){
            cb(r.status,r.message);
          }else{
            cb(null,r);
          }
        }
      };

      debug("xpush : ajax ", self.hostname+context,method,param);

      if(headers) {
        for (var key in headers) {
          if (headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, headers[key]);
          }
        }
      }
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send( (method == "POST") ? param : null);

      return;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      Stalk.prototype.ajax = _rest;
    } else {
      Stalk.prototype.ajax = _ajax;
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