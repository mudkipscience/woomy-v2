const Command = require('../../base/Command.js');

module.exports = class Colour extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Shows you a random colour or a colour generated from a hex code or text.',
        this.category = category;
        this.options = [
            {
                type: 3,
                name: 'input',
                description: 'hex code/text',
            }
        ];
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const input = await interaction.options.get('input');
        let color  = null;

        if (!input) {
            color = client.functions.randomColor();
        } else if (input.value.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
            color = input.value;
        } else {
            let hash = 0;
            const string = input.value;
            for (let i = 0; i < string.length; i++) {
                hash = string.charCodeAt(i) + ((hash << 5) - hash);
            }
            color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
        }

        const embed = new client.EmbedBuilder()
            .setTitle(color)
            .setColor(color)
            .setImage(`https://fakeimg.pl/256x256/${color.replace('#', '')}/?text=%20`)
            .setFooter({ text: 'Wow, thats a pretty one!'});

        interaction.reply({embeds: [embed]});
    }
};