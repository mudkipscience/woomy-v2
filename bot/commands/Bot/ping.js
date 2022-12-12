const Command = require('../../base/Command.js');
const replies = require('../../assets/replies.json');

module.exports = class Ping extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Check response time between Woomy and Discord',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const msg = await interaction.reply({ content: replies.ping.random(), fetchReply: true });
        interaction.editReply(`${msg.content} Roundtrip: \`${msg.createdTimestamp - interaction.createdTimestamp}ms\` Heartbeat: \`${client.ws.ping}ms\``);
    }
};