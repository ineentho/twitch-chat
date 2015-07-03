'use strict';

var TWITCH_WEBSOCKET_ADDR = 'ws://192.16.64.6:80';

var EventEmitter2 = require('eventemitter2').EventEmitter2,
    util          = require('util'),
    WebSocket     = require('ws');


/**
 * Connects you to the specified channel
 * @param channel The channel to connect to, eg `sodapoppin` or `monstercat`
 * @constructor
 */
var TwitchChat = module.exports = function TwitchChat(channel) {
    var self = this;
    this.username = genUsername();
    this.channel = channel;


    var ws = new WebSocket(TWITCH_WEBSOCKET_ADDR);

    ws.on('open', function () {
        // Connected to the WebSocket server, authenticate with the underlying IRC server
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
        ws.send('PASS blah');
        ws.send('NICK ' + self.username);
        ws.send('JOIN #' + self.channel);
    });

    ws.on('content', function (data) {
        if (data.indexOf('End of /NAMES list') !== -1) {
            // End of /NAMES list is the last content sent before you are considered as connected
            self.emit('connect');
        } else {
            var message = parseChatMessage(data);
            if (message) {
                self.emit('message', message.name, message.content);
            }
        }
    })
};

// TwitchChat extends from EventEmitter2
util.inherits(TwitchChat, EventEmitter2);

// This regex is used to determine if a content is a chat content and to extract useful information out of it
var chatRegex = /@color=(.*);display-name=(.*);emotes=(.*);subscriber=([0-9]*);turbo=([0-9]*);user-type=(.*)PRIVMSG #.* :(.*)/;

/**
 * Parses a raw chat content
 * @param message The content as received from the WebSocket
 * @returns {{}|boolean} An object containing the properties or false if it's not a chat content
 */
function parseChatMessage(message) {
    var res = chatRegex.exec(message);

    if (!res) {
        // Not chat content
        return false;
    }

    return {
        color: res[1],
        name: res[2],
        emotes: res[3],
        subscriber: res[4],
        turbo: res[5],
        userType: res[6],
        content: res[7]
    }
}

/**
 * Generates a guest username
 * @returns {string}
 */
function genUsername() {
    var userNumber = Math.floor(Math.random() * 999999);
    return 'justinfan' + userNumber;
}