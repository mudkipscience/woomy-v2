const Command = require('../../base/Command.js');
const fetch = require('node-fetch');

module.exports = class Inspire extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Generates a (likely terrible) inspirational quote.',
        this.category = category,
        this.cooldown = 10000;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        interaction.deferReply();
        fetch('http://inspirobot.me/api?generate=true', { headers: { 'User-Agent': client.config.userAgent }})
            .then(res => res.text())
            .then(body => interaction.editReply(body))
            .catch(err => {
                client.logger.error('INSPIRE_COMMAND_ERROR', `API err or err replying: ${err}`);
                return interaction.editReply(`${client.config.emojis.botError} An API error occurred, sorry! I've reported this to my developers.`);
            });
    }
};