const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandSubscribe extends DiscordCommand {

    constructor(subsystem) {
        super("subscribe", "подписаться на анонсы нового раунда", undefined, subsystem);
    }

    onRun(message, permissions, args) {
        var config = this.subsystem.manager.getSubsystem("Config").config;
        if (permissions.includes('unsubscribe')) {
            var response = "ты уже подписан"
        }
        else {
            message.member.addRole(config.discord_subscriber_role);
            var response = "ты теперь подписан"
        }

        message.reply(response);
    }

}

module.exports = DiscordCommandSubscribe;