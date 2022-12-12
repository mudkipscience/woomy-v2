const Command = require('../../base/Command.js');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/relativeTime'));

module.exports = class Avatar extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'View someone\'s public account information',
        this.options = [
            {
                type: 6,
                name: 'user',
                description: 'The user who you want '
            },
        ],
        this.usage = '/userinfo [user]',
        this.friendlyOptions = '`user` - The user to get information on (optional)',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const target = await interaction.options.getUser('user') ?? interaction.user;
        const user = await client.users.fetch(target.id, {force: true});
        const member = await interaction.guild.members.fetch(target.id, {force: true});

        const badges = [];
        if (client.config.devIds.includes(user.id)) badges.push('<:Woomy_Developer:816822318289518622> ');
        if (user.id === member.guild.ownerId) badges.push('<:owner:685703193694306331>');
        if (user.bot) badges.push('<:bot:686489601678114859>');

        const roles = [];
        for (const roleId of member._roles) {
            if (roles.length === 45) {
                roles.push(`and ${member.roles.length - 45} more`);
                break;
            }

            roles.push(`<@&${roleId}>`);
        }

        const embed = new client.EmbedBuilder()
            .setTitle(member.user.username + '#' + member.user.discriminator)
            .setColor(user.hexAccentColor ?? member.displayHexColor)
            .setThumbnail(member.displayAvatarURL({extension: 'png', 'size': 4096}))
            .addFields([
                {
                    name: 'Display Name', value: member.nick || user.username, inline: true
                },
                {
                    name: 'User ID', value: user.id, inline: true
                },
                {
                    name: 'Highest Role', value: `<@&${member.roles.highest.id}>`, inline: true
                },
                {
                    name: 'Roles:', value: roles.join(' ')
                },
                {
                    name: 'Joined Server', value: `${dayjs(member.joinedAt).format('D/M/YYYY HH:mm (UTCZ)')}\n*${dayjs().to(member.joinedAt)}*`, inline: true
                },
                {
                    name: 'Joined Discord', value: `${dayjs(member.user.createdAt).format('D/M/YYYY HH:mm (UTCZ)')}\n*${dayjs().to(member.user.createdAt)}*`, inline: true
                }
            ]);
        if (badges.length > 0) {
            embed.setDescription(badges.join(' '));
        }
        return await interaction.reply({embeds: [embed]});
    } 
};