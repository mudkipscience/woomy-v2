const Command = require('../../base/Command.js');
const { version, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');


module.exports = class About extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Bot information and statistics',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const uptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const bot = await interaction.guild.members.fetch(client.user.id, {force: true});
        const userCount = await client.db.countUsers();

        let build = 'prod';
        if (client.config.developmentMode === true) {
            build = 'dev';
        }

        const links = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL('https://discord.gg/HCF8mdv')
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL('https://gitdab.com/embee/woomy')
                    .setLabel('Source')
                    .setStyle(ButtonStyle.Link),
            );

        const embed = new client.EmbedBuilder()
            .setTitle('About me')
            .setThumbnail(client.user.avatarURL({format: 'png'}))
            .setColor(bot.user.hexAccentColor ?? bot.displayHexColor)
            .addFields([
                {
                    name: 'General',
                    value: `» Users: \`${userCount}\`\n» Servers: \`${client.guilds.cache.size}\`\n» Commands: \`${client.commands.size}\`\n» Uptime: \`${uptime}\``,
                    inline: true
                },
                {
                    name: 'Technical',
                    value: `» RAM Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\n» Woomy version: \`v${client.version} ${build}\`\n» discord.js version: \`v${version}\`\n» node.js version: \`${process.version}\``,
                    inline: true
                }
            ])
            .setFooter({ text: 'Made in Australia'});

        return interaction.reply({ embeds: [embed], components: [links] });
    }
};