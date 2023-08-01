// taken from https://discordjs.guide/

const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../botconfig.json');
const read = require('fs-readdir-recursive');
const commands = [];
const commandFiles = read('./commands').filter(file => file.endsWith('.js'));

if (process.argv.length === 2) {
    console.log('No guild ID provided, deployment failed.');
    process.exit(1);
}

const guildId = process.argv[2];

for (const file of commandFiles) {
    const command = new (require(__dirname + '/commands/' + file))(file.substr(file.indexOf('/') + 1).slice(0, -3), file.substr(0, file.indexOf('/')));
    commands.push({
        name: command.name,
        description: command.description,
        options: command.options,
        permissions: command.permissions,
        dm_permission: command.dm_permission
    });
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
