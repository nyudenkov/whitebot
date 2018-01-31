var APIEndpoint = require('../APIEndpoint.js');
var Discord = require('discord.js');

class EndpointASayMessage extends APIEndpoint {
  constructor(manager) {
    super(manager, "roundstatus");
  }

  request(data, callback) {
    if (data.status === undefined) {

      var error = {
        status: 400,
        response: "Missing status parameter."
      }

      return callback(error, undefined);
    }

    var config = this.manager.subsystemManager.getSubsystem("Config").config;
    var discord = this.manager.subsystemManager.getSubsystem("Discord");
    var byondSS = this.manager.subsystemManager.getSubsystem("Byond Connector");

    if (data.status == "lobby") {
      byondSS.roundNumber = data.round;

      var embed = new Discord.RichEmbed();

      embed.setAuthor("Информация", "https://avatars1.githubusercontent.com/u/31140765?s=70&v=4");
      embed.setDescription("Новый раунд скоро начнется! Присоединяйся сейчас: " + config.server_join_address);
      embed.setColor("62f442");

      var embedmessage = "<@&" + config.discord_subscriber_role + ">";

      for (var channel of discord.getPrimaryGuild().channels.array()) {
        if (channel.id == config.discord_public_channel) {
          channel.sendEmbed(embed, embedmessage);
        }
      }
      discord.client.user.setGame("Раунд начинается");
    }
    else if (data.status == "ingame") {
      discord.client.user.setGame("Раунд в процессе");
    }
    else {
      discord.client.user.setGame("Раунд кончился");
    }


    var response = {
      status: 200,
      response: "Status set."
    }

    return callback(undefined, response);
  }
}

module.exports = EndpointASayMessage;
