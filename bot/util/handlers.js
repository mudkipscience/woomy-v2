const fs = require('fs');

class CommandHandler {
    constructor (client) {
        this.client = client;
    }

    load (name, category) {
        try {
            const path = this.client.path + '/commands/' + category + '/' + name + '.js';
            const props = new (require(path))(this.client);

            this.client.logger.debug(`Loading command ${category}/${name}`);

            props.help.name = name;
            props.help.category = category;

            if (props.init) {
                props.init(this.client);
            }

            this.client.commands.set(props.help.name, props);
        
            this.client.cooldowns.set(props.help.name, new Map());

            props.conf.aliases.forEach(alias => {
                this.client.aliases.set(alias, props.help.name);
            });

            return;
        } catch (err) {
            return `Failed to load command ${name}: ${err.stack}`;
        }
    }

    loadAll () {
        const commandDirectories = fs.readdirSync('./commands/');
        this.client.logger.debug(`Found ${commandDirectories.length} command directories.`);
        commandDirectories.forEach((dir) => {
            const commandFiles = fs.readdirSync('./commands/' + dir + '/');
            commandFiles.filter((cmd) => cmd.split('.').pop() === 'js').forEach((cmd) => {
                cmd = cmd.substring(0, cmd.length - 3);
                const resp = this.load(cmd, dir);
                if (resp) {
                    this.client.logger.error(resp);
                }
            });
        });
        this.client.logger.info(`Loaded a total of ${this.client.commands.size} commands.`);
    }

    unload (name, category) {
        const path = this.client.path + '/commands/' + category + '/' + name + '.js';

        let command;

        if (this.client.commands.has(name)) {
            command = this.client.commands.get(name);
        } else if (this.client.aliases.has(name)) {
            command = this.client.commands.get(this.client.aliases.get(name));
        }

        if (!command) return `\`${name}\` does not exist as a command or an alias.`;

        this.client.logger.debug(`Unloading command ${category}/${name}`);

        for (const alias of command.conf.aliases) this.client.aliases.delete(alias);
        this.client.commands.delete(command.help.name);
        delete require.cache[require.resolve(path)];

        return;
    }

    unloadAll () {
        const commandDirectories = fs.readdirSync('./commands/');
        this.client.logger.debug(`Found ${commandDirectories.length} command directories.`);
        commandDirectories.forEach((dir) => {
            const commandFiles = fs.readdirSync('./commands/' + dir + '/');
            commandFiles.filter((cmd) => cmd.split('.').pop() === 'js').forEach((cmd) => {
                cmd = cmd.substring(0, cmd.length - 3);
                const res = this.unload(cmd, dir);
                if (res) this.client.logger.error('Command unload: ' + res);
            });
        });
    }
}

class EventHandler {
    constructor (client) {
        this.client = client;
    }

    load (name) {
        try {
            this.client.logger.debug(`Loading event ${name}`);

            const path = this.client.path + '/events/' + name + '.js';
            const event = new (require(path))(this.client);
            this.client.on(name, (...args) => event.run(...args));
            delete require.cache[require.resolve(path)];

            return;
        } catch (err) {
            return `Failed to load event ${name}: ${err}`;
        }
    }

    loadAll () {
        const eventFiles = fs.readdirSync(this.client.path + '/events');
        eventFiles.forEach(file => {
            const name = file.split('.')[0];
            const resp = this.load(name);

            if (resp) {
                this.client.logger.error(resp);
            }
        });
    }

    // TO-DO: EVENT UNLOADING/RELOADING
}

module.exports = {
    CommandHandler: CommandHandler,
    EventHandler: EventHandler
};