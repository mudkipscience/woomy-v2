const Command = require('../../base/Command.js');
const { version } = require('discord.js');
const moment = require('moment');
const { EmbedBuilder } = require('@discordjs/builders');
require('moment-duration-format');


module.exports = class About extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Bot information and statistics',
        this.category = category,
        this.usage = '/about';
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const uptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');

        let build = 'production';

        if (client.config.developmentMode === true) {
            build = 'development';
        }

        embed = new EmbedBuilder()
            .setColor(client.functions.embedColor(interaction.guild)
            .setThumbnail(client.user.vatarURL({format: "png"}))
            .setTitle('About me!')
            .addFields([
                {
                    name: 'General',
                    value: `• users: \`${client.users.cache.size}\`\n• channels: \`${client.channels.cache.size}\`\n• servers: \`${client.guilds.cache.size}\`\n• commands: \`${client.commands.size}\`\n• uptime: \`${uptime}\``,
                    inline: true
                },
                {
                    name: 'Technical',
                    value: `• RAM Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\n• Host OS: \`${require("os").type}\`\n• bot version: \`${client.version.number} (${build})\`\n• discord.js version: \`v${version}\`\n• node.js version: \`${process.version}\``,
                    inline: true
                },
                {
                    name: 'Links',
                    value: '[Support](https://discord.gg/HCF8mdv) | [Git](https://gitdab.com/embee/woomy)'
                }
            ])
        interaction.reply({embeds: embed})

    
    }
};