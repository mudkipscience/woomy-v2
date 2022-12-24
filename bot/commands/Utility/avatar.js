const Command = require('../../base/Command.js');

module.exports = class Avatar extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'View a full-sized version of someone\'s avatar.',
        this.options = [
            {
                type: 6,
                name: 'user',
                description: 'The user to get the avatar of.'
            },
        ],
        this.usage = '/avatar [user]',
        this.friendlyOptions = '`user` - The user to get the avatar of (optional)',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const target = await interaction.options.getUser('user') ?? interaction.user;
        const user = await client.users.fetch(target.id, {force: true});
        const member = await interaction.guild.members.fetch(target.id, {force: true});

        const embed = new client.EmbedBuilder()
            .setTitle(user.username + '#' + user.discriminator + '\'s avatar')
            .setColor(user.hexAccentColor ?? member.displayHexColor)
            .setDescription(`[Global avatar](${user.avatarURL({extension: 'png', 'size': 4096})})`)
            .setImage(member.displayAvatarURL({extension: 'png', 'size': 4096}));

        interaction.reply({embeds: [embed]});
    } 
};