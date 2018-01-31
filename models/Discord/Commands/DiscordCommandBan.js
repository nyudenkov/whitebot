const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandBan extends DiscordCommand {

  constructor(subsystem) {
    super("ban", "Забанить ебало.", 'ban', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    if(args.length < 1) {
      message.reply("Usage is `" + config.discord_command_character + "ban [@UserName] <reason>`");
      return;
    }

    var user = undefined;

    for (var auser of message.mentions.users.array()) {
      user = auser;
      break;
    }

    if(user == undefined) {
      message.reply("Не могу найти такого юзера, блять, ты уверен что ты сделал в таком формате: @Username ?");
      return;
    }

    var feedbackChannel = this.subsystem.getFeedbackChannel(message.guild);
    var guildMember = message.guild.fetchMember(user);
    guildMember.then(
      resolve => {
        args.shift();

        var reason = "Ризон где?";

        if(args.length > 0) {
          reason = args.join(" ");
        }
        var banStatus = this.subsystem.banManager.ban(resolve, reason, false);

        if(banStatus) {
          message.reply("Забанил ебало");
        } else {
          message.reply("Че-то ошибка какая-то, не могу забанить")
        }
      },
      (reject) => {
        message.reply("не могу найти ебало. ваще никак. он точно тут есть?");
      }
    );
  }

}

module.exports = DiscordCommandBan;
