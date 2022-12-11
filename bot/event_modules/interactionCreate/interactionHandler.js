module.exports = class {
    constructor (wsEvent) {
        this.wsEvent = wsEvent;
    }

    async run (client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        // Request all the data we need from the database
        const data = {};
        data.user = await client.db.getUser(interaction.user.id);
        data.guild = await client.db.getGuild(interaction.guild.id);
        data.member = await client.db.getMember(interaction.guild.id, interaction.user.id);
        
        const command = client.commands.get(interaction.commandName);

        // Return if the command is disabled globally
        if (command.enabled === false) interaction.reply({
            content: client.config.emojis.permError + ' This command has been disabled by my developers.',
            ephemeral: true
        });

        // Return if the command is restricted to developers (and the user is not a developer)
        if (command.devOnly === true && client.config.devIds.includes(interaction.user.id) !== true) {
            return interaction.reply({
                content: `${client.config.emojis.permError} ${interaction.user.username} is not in the sudoers file. This incident will be reported.`,
                ephemeral: true
            });
        }

        // Cooldown
        if (client.cooldowns.get(command.name).has(interaction.user.id)) {
            const timestamp = client.cooldowns.get(command.name).get(interaction.user.id);
            const currentTime = Date.now();
            const cooldown = command.cooldown / 1000;
            const timePassed = Math.floor((currentTime - timestamp) / 1000);
            return interaction.reply({
                content: `${client.config.emojis.wait} You need to wait ${cooldown - timePassed} seconds before using this command again.`,
                ephemeral: true
        });
        } else {
            client.cooldowns.get(command.name).set(interaction.user.id, new Date());
            setTimeout(() => {
                client.cooldowns.get(command.name).delete(interaction.user.id);
            }, client.commands.get(command.name).cooldown);
        }        

        // Try to execute the command, if it fails return error stack and inform the user
        try {
            command.run(client, interaction, data);
            client.logger.command(`Ran ${command.name}`);
        } catch (error) {
            client.logger.error('COMMAND_EXECUTION_ERROR', `${command.name}: ${error.stack}`);
            interaction.reply({
                content: `${client.config.emojis.botError} An error occurred when I was trying to run this command. I've sent through the details of the error to my developers.`,
                ephemeral: true
            });
        }
    }
};