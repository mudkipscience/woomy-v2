const Command = require('../../base/Command.js');
const { time } = require('discord.js');

module.exports = class Avatar extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'View information on this server.',
        this.usage = '/serverinfo',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const guild = await client.guilds.fetch(interaction.guild.id, {force: true});
        const members = await guild.members.fetch();
        const embed = new client.EmbedBuilder()
            .setColor(client.functions.embedColor(guild))
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL({extension: 'png', 'size': 4096}))  
            .addFields([
                {
                    name: 'ID', value: guild.id, inline: true
                },
                {
                    name: 'Owner', value: `<@${guild.ownerId}>`, inline: true
                },
                {
                    name: 'Created', value: time(guild.createdAt) + '\n' + time(guild.createdAt, 'R'), inline: true
                },
                {
                    name: 'Boosts', value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`, inline: true
                    
                },
                {
                    name: 'Members', 
                    value: `${members.size} Total\n${members.size - members.filter(member => member.user.bot).size} Humans\n${members.filter(member => member.user.bot).size}       Bots`,
                    inline: true
                },
                {
                    name: 'Channels', value: `${guild.channels.cache.size} ()`
                }
            ]);
        interaction.reply({ embeds: [embed] });
    } 
};