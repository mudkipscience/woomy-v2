const Command = require('../../base/Command.js');
const fetch = require('node-fetch');
const moment = require('moment');

module.exports = class Garfield extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'John I require lasagna',
        this.category = category;
        this.options = [
            {
                type: 1,
                name: 'daily',
                description: 'Get the comic for the current day.'
            },
            {
                type: 1,
                name: 'random',
                description: 'Get a random comic.'
            },
            {
                type: 1,
                name: 'from',
                description: 'Get the comic for a specific date.',
                options: [
                    {
                        type: 3,
                        name: 'date',
                        description: 'The date the comic you wish to view was published, formatted like so: YYYY-MM-DD',
                        required: true
                    }
                ]
            }
        ];
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        // set to get todays comic
        let url = 'https://garfield-comics.glitch.me/~SRoMG/?date=' + new Date();
        const subCmd = interaction.options.getSubcommand();
        const bot = await interaction.guild.members.fetch(client.user.id, {force: true});

        if (subCmd === 'from') {
            let unverifiedDate = await interaction.options.get('date').value;

            unverifiedDate = unverifiedDate.replaceAll('.', '-');
            unverifiedDate = unverifiedDate.replaceAll('/', '-');

            const verifiedDate = moment(unverifiedDate, 'YYYY-MM-DD', true);

            if (verifiedDate.isValid() === false) {
                return interaction.reply({
                    content: `${client.config.emojis.userError} The date you provided is not valid. Please format the date as follows: \`YYYY-MM-DD\``,
                    ephemeral: true
                });
            }
            url = 'https://garfield-comics.glitch.me/~SRoMG/?date=' + verifiedDate;

        } else if (subCmd === 'random') {
            url = 'https://garfield-comics.glitch.me/~SRoMG/?date=xxxx';
        }

        await interaction.deferReply();

        fetch(url, { headers: { 'User-Agent': client.config.userAgent }})
            .then(res => res.json())
            .then(json => {
                const embed = new client.EmbedBuilder()
                    .setTitle(`#${json.data.number}: ${json.data.name}`)
                    .setColor(bot.user.hexAccentColor ?? bot.displayHexColor)
                    .setImage(json.data.image.src);
                interaction.editReply({ embeds: [embed] });
            }).catch(err => {
                client.logger.error('GARFIELD_COMMAND_ERROR', `API err or err replying: ${err}`);
                return interaction.editReply(`${client.config.emojis.botError} An API error occurred, sorry! I've reported this to my developers.`);
            });
        
    }
};