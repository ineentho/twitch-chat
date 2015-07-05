'use strict';

var TwitchChat = require('..'); // require('twitch-chat') if downloading from npm

var chat = new TwitchChat('monstercat');
console.log('Joining the ' + chat.channel + ' chat channel...');

chat.on('connect', function () {
    console.log('Connected');
});

chat.on('disconnect', function () {
    console.log('Disconnected');
});

chat.on('message', function (user, message) {
    console.log(user + ': ' + message);
});
