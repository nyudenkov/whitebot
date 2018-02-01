const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandBan extends DiscordCommand {

  constructor(subsystem) {
    super("ban", "забанить человека.", 'ban', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    if(args.length < 1) {
      message.reply("\nИспользование: `" + config.discord_command_character + "ban [@UserName] <reason>`");
      return;
    }

    var user = undefined;

    for (var auser of message.mentions.users.array()) {
      user = auser;
      break;
    }

    if(user == undefined) {
      message.reply("\nНе могу найти.");
      return;
    }

    var feedbackChannel = this.subsystem.getFeedbackChannel(message.guild);
    var guildMember = message.guild.fetchMember(user);
    guildMember.then(
      resolve => {
        args.shift();

        var reason = "Нет причины.";

        if(args.length > 0) {
          reason = args.join(" ");
        }
        var banStatus = this.subsystem.banManager.ban(resolve, reason, false);

        if(banStatus) {
          message.reply("\nЗабанил.");
        } else {
          message.reply("\nНевозможно забанить.")
        }
      },
      (reject) => {
        message.reply("\nОтклонено. Ошибка.");
      }
    );
  }

}

module.exports = DiscordCommandBan;
