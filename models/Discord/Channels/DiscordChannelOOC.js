const DiscordChannel = require('../DiscordChannel.js');
var windows1251 = require('windows-1251');

class DiscordChannelOOC extends DiscordChannel {

    constructor(subsystem) {
        var config = subsystem.manager.getSubsystem("Config").config;
        super(subsystem, config.discord_ooc_channel);
    }

    onMessage(message) {
        var byondConnector = this.subsystem.manager.getSubsystem("Byond Connector").byondConnector;
        var config = this.subsystem.manager.getSubsystem("Config").config;
        byondConnector.request("?ooc=" + windows1251.encode(message.content) + "&admin=" + windows1251.encode(message.author.username) + "&key=" + config.server_key, (results) => {
            if ('error' in results) {
                message.reply(results.error);
            }
        });
    }

}

module.exports = DiscordChannelOOC;
