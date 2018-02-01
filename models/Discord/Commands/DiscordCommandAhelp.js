const DiscordCommand = require('../DiscordCommand.js');
var windows1251 = require('windows-1251')
class DiscordCommandAhelp extends DiscordCommand {
  constructor(subsystem) {
    super("ah", "ответить на АХелп.", 'ah', subsystem);
  }
  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    var byondConnector = this.subsystem.manager.getSubsystem("Byond Connector").byondConnector;
    if (args.length < 1) {
      message.reply("\nИспользование: `" + config.discord_command_character + "ah ckey message`");
      return;
    }
    var ahelpCkey = args[0];
    args.shift();
    var ahelpResponse = args.join(" ");
    byondConnector.request("?adminhelp" + "&ckey=" + windows1251.encode(ahelpCkey) + "&admin=" + windows1251.encode(message.author.username) + "&response=" + windows1251.encode(ahelpResponse) + "&key=" + config.server_key, (results) => {
      if ('error' in results) {
        message.reply(results.error);
      }
    });
    message.delete()
  }
}
module.exports = DiscordCommandAhelp;
