const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/relativeTime'));

module.exports = class {
    constructor (name, category) {
        this.name = name,
        this.category = category,
        this.enabled = true,
        this.devOnly = false,
        this.aliases = ['user'],
        this.userPerms = [],
        this.botPerms = [],
        this.cooldown = 2000,
        this.help = {
            description: 'Get information on a user.',
            arguments: '[user]',
            details: '',
            examples: 'userinfo\nuserinfo Octavia\nuserinfo @Animals'
        };
    }

    async run (client, message, args, data) { //eslint-disable-line no-unused-vars
        let member = message.member;
        
        if (args[0]) {
            if (message.mentions.length > 0) {
                member = await message.guild.members.fetch(message.mentions[0].id)
            } else {
                member = await client.functions.validateUserID(message.guild, args[0]);

                if (!member) {
                    member = await message.guild.searchMembers(args.join(' '), 2);
                
                    if (member.length === 0) return message.channel.send(
                        `${client.config.emojis.userError} No users found. Check for mispellings, or ping the user instead.`
                    );
            
                    if (member.length > 1) return message.channel.send(
                        `${client.config.emojis.userError} Found more than one user, try refining your search or pinging the user instead.`
                    );
            
                    member = member[0];
                }
            }
        }

        const badges = [];
        
        if (client.config.ownerIDs.includes(member.id)) badges.push('<:Woomy_Developer:816822318289518622> ');
        if (member.id === member.guild.ownerId) badges.push('<:owner:685703193694306331>');
        if (member.bot) badges.push('<:bot:686489601678114859>');

        const roles = [];

        for (const roleID of member.roles) {
            if (roles.length === 45) {
                roles.push(`and ${member.roles.length - 45} more`);
                break;
            }

            roles.push(`<@&${roleID}>`);
        }

        const embed = new client.MessageEmbed()
            .setTitle(member.user.username + '#' + member.user.discriminator)
            .setColor(client.functions.embedColor(message.guild, member))
            .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
            .addField('Display Name', member.nick || member.user.username, true)
            .addField('User ID', member.id, true)
            .addField('Highest Role', `<@&${client.functions.highestRole(member).id}>`, true)
            .addField('Roles:', roles.join(' '))
            .addField('Joined Server', `${dayjs(member.joinedAt).format('D/M/YYYY HH:mm (UTCZ)')}\n*${dayjs().to(member.joinedAt)}*`, true)
            .addField('Joined Discord', `${dayjs(member.user.createdAt).format('D/M/YYYY HH:mm (UTCZ)')}\n*${dayjs().to(member.user.createdAt)}*`, true);
        if (badges.length > 0) embed.setDescription(badges.join(' '));

        message.channel.send({ embeds: [embed] });
    }
};