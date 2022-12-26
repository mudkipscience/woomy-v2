const Command = require('../../base/Command.js');
const fetch = require('node-fetch');
const { pagination } = require('@devraelfreeze/discordjs-pagination');
const prettifyMiliseconds = require('pretty-ms');

module.exports = class Splatnet extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'View the current map rotation, salmon run gear and SplatNet gear for Splatoon 3',
        this.category = category,
        this.options = [
            {
                type: 1,
                name: 'maps',
                description: 'Get current and upcoming map rotations for turf war, anarchy and X-rank battles.'
            },
            {
                type: 1,
                name: 'sr',
                description: 'Get current and upcoming map rotations for salmon run, as well as the monthly gear reward.'
            },
            {
                type: 1,
                name: 'gear',
                description: 'View the gear currently available on the SplatNet mobile app.'
            }
        ];
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const subCmd = interaction.options.getSubcommand();
        const embeds = [];

        await interaction.deferReply();

        if (subCmd === 'maps') {
            if (client.cache.has('SPLATNET_MAPS') && Date.now() > client.cache.get('SPLATNET_MAPS').expiry) {
                client.cache.delete('SPLATNET_MAPS');
            }

            if (!client.cache.has('SPLATNET_MAPS')) {
                fetch('https://splatoon3.ink/data/schedules.json', { headers: { 'User-Agent': client.config.userAgent }})
                    .then(res => res.json())
                    .then(async json => {
                        // cache data so we dont spam API
                        client.cache.set('SPLATNET_MAPS', {data: json, expiry: new Date(json.data.xSchedules.nodes[0].endTime)});

                        embeds.push(new client.EmbedBuilder()
                            .setTitle('Current Splatoon 3 Maps')
                            .setColor(interaction.guild.members.me.displayHexColor)
                            .addFields(
                                {
                                    name: '<:turf_war:814651383911153692> Turf War',
                                    value: `${json.data.regularSchedules.nodes[0].regularMatchSetting.vsStages[0].name}\n${json.data.regularSchedules.nodes[0].regularMatchSetting.vsStages[1].name}`,
                                    inline: true
                                },
                                {
                                    name: `<:ranked:814651402479468544> Anarchy Series: ${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsRule.name}`,
                                    value: `${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsStages[1].name}`,
                                    inline: true
                                },
                                {
                                    name: `<:ranked:814651402479468544> Anarchy Open: ${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsRule.name}`,
                                    value: `${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsStages[1].name}`,
                                    inline: true
                                },
                                {
                                    name: `<:xRank:1056806341575970898> X rank: ${json.data.xSchedules.nodes[0].xMatchSetting.vsRule.name}`,
                                    value: `${json.data.xSchedules.nodes[0].xMatchSetting.vsStages[0].name}\n${json.data.xSchedules.nodes[0].xMatchSetting.vsStages[1].name}`,
                                    inline: true
                                }
                            )
                            .setFooter({ text: `Maps changing in ${prettifyMiliseconds(new Date(json.data.xSchedules.nodes[0].endTime).getTime() - Date.now(), { secondsDecimalDigits: 0 })} - Data provided by splatoon3.ink`})
                        );  
                        for (let i = 1; i < json.data.regularSchedules.nodes.length; i++) {
                            embeds.push(new client.EmbedBuilder()
                                .setTitle('Upcoming Splatoon 3 Maps')
                                .setColor(interaction.guild.members.me.displayColor)
                                .addFields(
                                    {
                                        name: '<:turf_war:814651383911153692> Turf War',
                                        value: `${json.data.regularSchedules.nodes[i].regularMatchSetting.vsStages[0].name}\n${json.data.regularSchedules.nodes[i].regularMatchSetting.vsStages[1].name}`,
                                        inline: true
                                    },
                                    {
                                        name: `<:ranked:814651402479468544> Anarchy Series: ${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsRule.name}`,
                                        value: `${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsStages[1].name}`,
                                        inline: true
                                    },
                                    {
                                        name: `<:ranked:814651402479468544> Anarchy Open: ${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsRule.name}`,
                                        value: `${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsStages[1].name}`,
                                        inline: true
                                    },
                                    {
                                        name: `X rank: ${json.data.xSchedules.nodes[i].xMatchSetting.vsRule.name}`,
                                        value: `${json.data.xSchedules.nodes[i].xMatchSetting.vsStages[0].name}\n${json.data.xSchedules.nodes[i].xMatchSetting.vsStages[1].name}`,
                                        inline: true
                                    }
                                )
                                .setFooter({ text: `Starting in ${prettifyMiliseconds(new Date(json.data.xSchedules.nodes[i].startTime).getTime() - Date.now(), { secondsDecimalDigits: 0 })} - Data provided by splatoon3.ink`})
                            );
                        }
                        await pagination({
                            embeds: embeds,
                            author: interaction.member.user,
                            interaction: interaction,
                            time: 60000,
                            disableButtons: false,
                        });
                    })
                    .catch(err => {
                        client.logger.error('SPLATNET_COMMAND_ERROR', `API err or err replying: ${err.stack}`);
                        return interaction.editReply(`${client.config.emojis.botError} An error occurred, sorry! I've reported this to my developers.`);
                    });
            } else {
                let json = client.cache.get('SPLATNET_MAPS');
                json = json.data;
                embeds.push(new client.EmbedBuilder()
                    .setTitle('Current Splatoon 3 Maps')
                    .setColor(interaction.guild.members.me.displayColor)
                    .addFields(
                        {
                            name: '<:turf_war:814651383911153692> Turf War',
                            value: `${json.data.regularSchedules.nodes[0].regularMatchSetting.vsStages[0].name}\n${json.data.regularSchedules.nodes[0].regularMatchSetting.vsStages[1].name}`,
                            inline: true
                        },
                        {
                            name: `<:ranked:814651402479468544> Anarchy Series: ${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsRule.name}`,
                            value: `${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[0].vsStages[1].name}`,
                            inline: true
                        },
                        {
                            name: `<:ranked:814651402479468544> Anarchy Open: ${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsRule.name}`,
                            value: `${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[0].bankaraMatchSettings[1].vsStages[1].name}`,
                            inline: true
                        },
                        {
                            name: `X rank: ${json.data.xSchedules.nodes[0].xMatchSetting.vsRule.name}`,
                            value: `${json.data.xSchedules.nodes[0].xMatchSetting.vsStages[0].name}\n${json.data.xSchedules.nodes[0].xMatchSetting.vsStages[1].name}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `Maps changing in ${prettifyMiliseconds(new Date(json.data.xSchedules.nodes[0].endTime).getTime() - Date.now(), { secondsDecimalDigits: 0 })} - Data provided by splatoon3.ink`})
                );  
                
                for (let i = 1; i < json.data.regularSchedules.nodes.length; i++) {
                    embeds.push(new client.EmbedBuilder()
                        .setTitle('Upcoming Splatoon 3 Maps')
                        .setColor(interaction.guild.members.me.displayColor)
                        .addFields(
                            {
                                name: '<:turf_war:814651383911153692> Turf War',
                                value: `${json.data.regularSchedules.nodes[i].regularMatchSetting.vsStages[0].name}\n${json.data.regularSchedules.nodes[i].regularMatchSetting.vsStages[1].name}`,
                                inline: true
                            },
                            {
                                name: `<:ranked:814651402479468544> Anarchy Series: ${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsRule.name}`,
                                value: `${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[0].vsStages[1].name}`,
                                inline: true
                            },
                            {
                                name: `<:ranked:814651402479468544> Anarchy Open: ${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsRule.name}`,
                                value: `${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsStages[0].name}\n${json.data.bankaraSchedules.nodes[i].bankaraMatchSettings[1].vsStages[1].name}`,
                                inline: true
                            },
                            {
                                name: `X rank: ${json.data.xSchedules.nodes[i].xMatchSetting.vsRule.name}`,
                                value: `${json.data.xSchedules.nodes[i].xMatchSetting.vsStages[0].name}\n${json.data.xSchedules.nodes[i].xMatchSetting.vsStages[1].name}`,
                                inline: true
                            }
                        )
                        .setFooter({ text: `Starting in ${prettifyMiliseconds(new Date(json.data.xSchedules.nodes[i].startTime).getTime() - Date.now(), { secondsDecimalDigits: 0 })} - Data provided by splatoon3.ink`})
                    );
                }
                interaction.editReply({embeds: [embeds[0]]});
            }
            
        }
    }
};