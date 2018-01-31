const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandKick extends DiscordCommand {

  constructor(subsystem) {
    super("kick", "Кикает мразб", 'kick', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;

    if (args.length < 1) {
      message.reply("Usage is `" + config.discord_command_character + "kick [@UserName] <reason>`");
      return;
    }

    var user = undefined;

    for (var auser of message.mentions.users.array()) {
      user = auser;
      break;
    }

    if (user == undefined) {
      message.reply("Не могу найти такого юзера, блять, ты уверен что ты сделал в таком формате: @Username ?");
      return;
    }


    var guildMember = message.guild.fetchMember(user);
    guildMember.then(
      (resolve) => {
        var kickeeperms = this.subsystem.permissionManager.getUserPermissions(resolve);
        if (resolve.id == message.member.id) {
          message.reply("ты не можешь кикнуть сам себя, ебан");
          return;
        }
        if (kickeeperms.includes("kick")) {
          message.reply("ты че охуел своих кикать");
          return;
        }

        args.shift();

        var reason = "ризон мне внятный для кика дай";

        if (args.length > 0) {
          reason = args.join(" ");
        }

        resolve.kick(0).then(
          (resolve) => {
            this.subsystem.logger.log("info", message.author.username + "#" + message.author.discriminator + " (" + message.author.id + ") kicked " + resolve.user.username + "#" + resolve.user.discriminator);
            message.reply(resolve.user.username + " Was kicked from the server for `" + reason + "`.");
          },
          (reject) => {
            message.reply("ошибка!!!!!!");
          }
        );
      },
      (reject) => {
        message.reply("не могу найти ебало. ваще никак. он точно тут есть?");
      }
    );
  }

}

module.exports = DiscordCommandKick;
