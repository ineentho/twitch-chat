'use strict';

var TwitchChat = require('..'); // require('twitch-chat') if downloading from npm

var sodaChat = new TwitchChat('sodapoppin');

sodaChat.on('connect', function () {
    console.log('Connected');
});

sodaChat.on('disconnect', function () {
    console.log('Disconnected');
});

sodaChat.on('message', function (user, message) {
    console.log(user + ': ' + message);
});