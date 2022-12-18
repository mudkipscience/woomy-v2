const Command = require('../../base/Command.js');

module.exports = class Help extends Command {
    constructor (name, category) {
        super (name, category);
        this.name = name,
        this.description = 'Lists all the commands you can use',
        this.options = [
            {
                type: 3,
                name: 'command',
                description: 'The command to get information on'
            },
        ],
        this.usage = '/help [command]',
        this.friendlyOptions = '`command` - The command to get information on',
        this.category = category;
    }

    async run (client, interaction, data) { //eslint-disable-line no-unused-vars
        const input = await interaction.options.get('command');
        const bot = await interaction.guild.members.fetch(client.user.id, {force: true});
        const categories = [];

        client.commands.forEach(cmd => {
            if (!categories.includes(cmd.category)) {
                if (cmd.category === 'Developer' && !client.config.devIds.includes(interaction.user.id)) return;
                categories.push(cmd.category);
            }
        });

        
        
        if (!input) {
            const fields = [];
            const embed = new client.EmbedBuilder()
                .setTitle('Command list')
                .setColor(bot.displayHexColor)
                .setDescription(
                    `
                    » Use \`/help [command]\` to get full information on a specific command.
	                » [Click here](https://discord.gg/HCF8mdv) to join my support server if you need help!
	                » [Click here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2134240503&scope=bot) to invite me to your server!
                    `
                )
                .setFooter({text: 'Thank you for using Woomy! 🦑'});

            categories.forEach(cat => {
                let cmds = '`';
                const filteredCmds = client.commands.filter(cmd => cmd.category === cat);
                filteredCmds.forEach(cmd => {
                    cmds += (cmd.name + '`, `');
                });

                cmds = cmds.substr(0, cmds.length - 3);

                fields.push({name: cat.toProperCase() + ':', value: cmds});
            });

            embed.addFields(fields);

            return interaction.reply({ embeds: [embed] });
        } else if (client.commands.has(input.value)) {
            const command = await client.commands.get(input.value);
            const embed = new client.EmbedBuilder()
                .setTitle(`${command.category} -> ${command.name.toProperCase()}`)
                .setColor(bot.user.hexAccentColor ?? bot.displayHexColor)
                .setDescription(command.description)
                .setFooter({ text: '<> = required, / = either/or, [] = optional'});

            const fields = [];

            if (command.usage !== 'No usage information provided.') {
                fields.push({name: 'Usage:', value: command.usage});
            }
            
            if (command.friendlyOptions !== 'No options provided.') {
                fields.push({name: 'Options', value: command.friendlyOptions});
            }

            if (fields.length > 0) embed.addFields(fields);

            return interaction.reply({ embeds: [embed] });
        }
        return interaction.reply(`${client.config.emojis.userError} A command of that name could not be found.`);
    } 
};