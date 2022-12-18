const Command = require('../../base/Command.js');
const { time } = require('discord.js');

module.exports = class Avatar extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'View information on this server.',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const guild = await client.guilds.fetch(interaction.guild.id, {force: true});
        const members = await guild.members.fetch();
        const roles = await interaction.guild.roles.cache;
        const channels = await interaction.guild.channels.cache;

        let verificationLevel = 'None';

        /* eslint-disable indent */
        switch (guild.verificationLevel) {
            case 1: {
                verificationLevel = 'Low';
                break;
            }
            case 2: {
                verificationLevel = 'Medium';
                break;
            }
            case 3: {
                verificationLevel = 'High';
                break;
            }
            case 4: {
                verificationLevel = 'Very high';
                break;
            }
        }
        /* eslint-disable indent */

        let mfaLevel = 'None';
        if (guild.mfaLevel === 1) {
            mfaLevel = '2FA required';
        }

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
                    name: 'Locale', value: guild.preferredLocale, inline: true
                },
                {
                    name: 'Verification level', value: verificationLevel, inline: true
                },
                {
                    name: 'MFA level', value: mfaLevel, inline: true, 
                },
                {
                    name: 'Boosts', value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`, inline: true
                    
                },
                {
                    name: `Members (${members.size})`, 
                    value: `${members.size - members.filter(member => member.user.bot).size} Humans, ${members.filter(member => member.user.bot).size} Bots`,
                    inline: true
                },
                {
                    name: 'Channels', value: `${channels.filter(channel => channel.type === 0 || channel.type === 5).size} Text, ${channels.filter(channel => channel.type === 2 || channel.type === 13).size} Voice`, inline: true
                },
                {
                    name: 'Roles', value: roles.size.toString(), inline: true
                },
                {
                    name: 'Created', value: time(guild.createdAt, 'D') + time(guild.createdAt, 'R'), inline: true
                },
                {
                    name: 'Features', value: guild.features.join(', ')
                }
            ]);
        interaction.reply({ embeds: [embed] });
    } 
};