const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandKick extends DiscordCommand {

  constructor(subsystem) {
    super("kick", "кикает человека.", 'kick', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;

    if (args.length < 1) {
      message.reply("\nИспользование: `" + config.discord_command_character + "kick [@UserName] <reason>`");
      return;
    }

    var user = undefined;

    for (var auser of message.mentions.users.array()) {
      user = auser;
      break;
    }

    if (user == undefined) {
      message.reply("\nНе могу найти.");
      return;
    }


    var guildMember = message.guild.fetchMember(user);
    guildMember.then(
      (resolve) => {
        var kickeeperms = this.subsystem.permissionManager.getUserPermissions(resolve);
        if (resolve.id == message.member.id) {
          message.reply("\nТы не можешь кикнуть сам себя.");
          return;
        }
        if (kickeeperms.includes("kick")) {
          message.reply("\nТы не можешь кикать тех, кто владеет правами на кик.");
          return;
        }

        args.shift();

        var reason = "Нет причины.";

        if (args.length > 0) {
          reason = args.join(" ");
        }

        resolve.kick(0).then(
          (resolve) => {
            this.subsystem.logger.log("info", message.author.username + "#" + message.author.discriminator + " (" + message.author.id + ") kicked " + resolve.user.username + "#" + resolve.user.discriminator);
            message.reply(resolve.user.username + " Was kicked from the server for `" + reason + "`.");
          },
          (reject) => {
            message.reply("\nОшибка.");
          }
        );
      },
      (reject) => {
        message.reply("\nОшибка.");
      }
    );
  }

}

module.exports = DiscordCommandKick;
