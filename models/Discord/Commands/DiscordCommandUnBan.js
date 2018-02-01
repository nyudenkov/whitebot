const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandUnBan extends DiscordCommand {

  constructor(subsystem) {
    super("unban", "разбанить человека.", 'ban', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    if (args.length < 1) {
      message.reply("\nИспользование: `" + config.discord_command_character + "unban [@UserName] <reason>`");
      return;
    }

    var user = undefined;

    for (var auser of message.mentions.users.array()) {
      user = auser;
      break;
    }

    if (user == undefined) {
      message.reply("\nНе могу найти");
      return;
    }

    var guildMember = message.guild.fetchMember(user);
    guildMember.then(
      resolve => {
        args.shift();

        var reason = "Нет причины.";

        if (args.length > 0) {
          reason = args.join(" ");
        }

        var banStatus = this.subsystem.banManager.unban(resolve.guild, resolve, reason);

        if (banStatus) {
          this.subsystem.logger.log("info", message.author.username + "#" + message.author.discriminator + " (" + message.author.id + ") unbanned " + resolve.author.username + "#" + resolve.author.discriminator + " (" + resolve.author.id + ") for \"" + reason + "\".");
          message.reply("\nРазбанил.");
        }
        else {
          message.reply("\nПерепроверьте ник.");
        }
      },
      reject => {
        message.reply("\nНе могу найти.");
      }
    );
  }

}

module.exports = DiscordCommandUnBan;
