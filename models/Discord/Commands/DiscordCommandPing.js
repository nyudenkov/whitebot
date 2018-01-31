const DiscordCommand = require('../DiscordCommand.js');

class DiscordCommandPing extends DiscordCommand {

  constructor(subsystem) {
    super("ping", "Пингует сервер и показывает сколько игроков онлайн.", 'ping', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    var byondConnector = this.subsystem.manager.getSubsystem("Byond Connector").byondConnector;

    byondConnector.request("?ping", (results) => {
      if('error' in results) {
        message.reply(results.error);
      } else {
        message.reply("Там **" + results.data + "** игроков онлайн, присоединяйся к ним написав **\"" + config.server_join_address + "\"** в адресной строке браузера");
      }
    });
  }

}

module.exports = DiscordCommandPing;
