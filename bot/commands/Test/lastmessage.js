const Command = require("../../base/Command.js");

class Lastmessage extends Command {
  constructor (client) {
    super(client, {
      description: "Grab last message sent to a channel.",
      usage: "lastmessage",
    });
  }

  async run (message, args, data) { // eslint-disable-line no-unused-vars
    const lastMsg = await this.client.functions.getLastMessage(message.channel);
    message.channel.send(lastMsg);
  }
}

module.exports = Lastmessage;
