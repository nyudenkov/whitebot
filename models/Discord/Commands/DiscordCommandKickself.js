const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandKickself extends DiscordCommand {

	constructor(subsystem) {
		super("kickself", "кикает тебя из канала.", undefined, subsystem);
	}

	onRun(message, permissions, args) {
		if (permissions.includes("kickself")) {
			message.reply("Не могу кикать тех, у кого есть права на кик себя.");
		}
		else {
			var guildMember = message.member;
			message.channel.send(guildMember + " пнул сам себя с сервера.");
			guildMember.kick();
		}
	}
}

module.exports = DiscordCommandKickself;
