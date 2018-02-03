const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandHelp extends DiscordCommand {

  constructor(subsystem) {
    super("help", "показывает команды к которым у вас есть доступ. \n    `!help hidden` - показывает скрытые команды.", undefined, subsystem);
  }

  onRun(message, permissions, args) {
    var response = "\nДоступные команды: \n";
    var config = this.subsystem.manager.getSubsystem("Config").config;

    var helpOption = args[0];

    if (helpOption == "hidden") {
      for (var command of this.subsystem.commands) {
        if (command.hidden) {
          response += "    `" + config.discord_command_character + command.name + "` - " + command.description + "\n";
        }
      }
    }
    else {
      for (var command of this.subsystem.commands) {
        if (command.hidden) {
          continue;
        }
        if (command.hasPermission(permissions) || this.subsystem.permissionManager.permissions["admins"].includes(message.author.id)) {
          response += "    `" + config.discord_command_character + command.name + "` - " + command.description + "\n";
        }
      }
    }
    message.reply(response);
  }

}

module.exports = DiscordCommandHelp;
