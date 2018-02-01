const DiscordCommand = require('../DiscordCommand.js');
const spawn = require('child_process').spawn;

class DiscordCommandReboot extends DiscordCommand {

  constructor(subsystem) {
    super("reboot", "перезагружает сервер.", 'reboot', subsystem);
  }

  onRun(message, permissions, args) {
    var config = this.subsystem.manager.getSubsystem("Config").config;
    if (args.length < 1) {
      message.reply("Доступные команды: \n     `" + config.discord_command_character + "reboot hard` Убивает демона и стартует новый. \n     `" + config.discord_command_character + "reboot soft` говорит серверу ребутнуться. \n     `" + config.discord_command_character + "reboot bot` демону бота говорит ребутнуться и обновиться.");
      return;
    }

    var rebootOption = args[0];
    this.subsystem.logger.log("info", message.author.username + "#" + message.author.discriminator + " (" + message.author.id + ") tried to reboot the server with the " + rebootOption + " reboot option.");

    switch (rebootOption) {
    case 'hard':
      var taskkill = spawn('taskkill', ['/F', '/IM', 'dreamdaemon.exe']);
      taskkill.on('exit', (code) => {
        message.reply("Hard reboot exited with exit code: " + code);
      });
      break;
    case 'soft':
      var request = "?reboot&key=" + config.server_key;
      byondConnector.request(request, (results) => {
        if ('error' in results) {
          message.reply(results.error);
        }
        else {
          message.reply(results.data);
        }
      });
      break;
    case 'bot':
      message.reply("Updating & Rebooting Bot.").then(() => {
        this.subsystem.manager.getSubsystem("Updater").update((data) => {
          message.reply(data);
        });
      });
      break;
    default:
      message.reply("Используй `hard`, `soft` или `bot`");
      break;

    }
  }

}

module.exports = DiscordCommandReboot;
