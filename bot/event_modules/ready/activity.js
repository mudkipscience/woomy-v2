const Event = require("../../base/Event.js");
const activities = require('../../assets/activities.json');
module.exports = class Activity extends Event {
    constructor (wsEvent) {
        super (wsEvent);
        this.wsEvent = wsEvent;
    }

    async run (client) {
        const activity = activities.random();
        client.user.setPresence({ activities: [{ name: `${activity.message} | v${client.version}` }], status: 'online' });
    }
};