const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandUnsubscribe extends DiscordCommand {

    constructor(subsystem) {
        super("unsubscribe", "отписаться от подписки", 'unsubscribe', subsystem);
    }

    onRun(message, permissions, args) {
        var config = this.subsystem.manager.getSubsystem("Config").config;
        message.member.removeRole(config.discord_subscriber_role);
        message.reply("Ты отписался");
    }

}

module.exports = DiscordCommandUnsubscribe;