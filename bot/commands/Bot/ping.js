const Command = require("../../base/Command.js");

module.exports = class Ping extends Command {
    constructor (name, category) {
        super (name, category)
        this.name = name,
        this.description = 'Check response time between Woomy and Discord',
        this.category = category
    }

    run (client, interaction, data) { //eslint-disable-line no-unused-vars
        return interaction.reply('Pong! Did I do this right?');
    }
};