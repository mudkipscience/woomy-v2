const Event = require('../../base/Event.js');
module.exports = class Ready extends Event {
    constructor (wsEvent) {
        super (wsEvent);
        this.wsEvent = wsEvent;
    }

    async run (client) {
        client.logger.event(`Logged in as ${client.user.username + '#' + client.user.discriminator} and ready to accept commands! | v${client.version}`);
    }
};