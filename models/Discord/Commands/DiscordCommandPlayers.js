const DiscordCommand = require('../DiscordCommand.js');
const StringUtils = require('../../Utils/String.js');

class DiscordCommandWho extends DiscordCommand {

  constructor(subsystem) {
    super("who", "Получение списка игроков на сервере", 'who', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    var byondConnector = this.subsystem.manager.getSubsystem("Byond Connector").byondConnector;

    byondConnector.request("?who", (results) => {
      if('error' in results) {
        message.reply(results.error);
      } else {
        var players = StringUtils.replaceAll(results.data, "\0", "");
        message.reply(players);
      }
    });
  }

}

module.exports = DiscordCommandWho;
