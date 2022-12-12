/* eslint-disable indent */
class EventHandler {
    
    constructor (client) {
        this.client = client;
    }

    handle (wsEvent, param_1, param_2) {
        switch (wsEvent) {
            case 'ready': {
                const readyModules = this.client.eventModules.filter(module => module.wsEvent === 'ready');
                readyModules.forEach(module => module.run(this.client));
                break;
            }

            case 'error': {
                const errorModules = this.client.eventModules.filter(module => module.wsEvent === 'error');
                errorModules.forEach(module => module.run(this.client, param_1));
                break;
            }

            case 'messageCreate': {
                const mCreateModules = this.client.eventModules.filter(module => module.wsEvent === 'messageCreate');
                mCreateModules.forEach(module => module.run(this.client, param_1));
                break;
            }

            case 'interactionCreate': {
                const iCreateModules = this.client.eventModules.filter(module => module.wsEvent === 'interactionCreate');
                iCreateModules.forEach(module => module.run(this.client, param_1));
                break;
            }

            case 'guildCreate': {
                const gCreateModules = this.client.eventModules.filter(module => module.wsEvent === 'guildCreate');
                gCreateModules.forEach(module => module.run(this.client, param_1));
                break;
            }

            case 'guildDelete': {
                const gDeleteModules = this.client.eventModules.filter(module => module.wsEvent === 'guildDelete');
                gDeleteModules.forEach(module => module.run(this.client, param_1));
                break;
            }

            case 'guildMemberAdd': {
                const gMemberAddModules = this.client.eventModules.filter(module => module.wsEvent === 'guildMemberAdd');
                gMemberAddModules.forEach(module => module.run(this.client, param_1, param_2));
                break;
            }

            case 'guildMemberRemove': {
                const gMemberRemoveModules = this.client.eventModules.filter(module => module.wsEvent === 'guildMemberRemove');
                gMemberRemoveModules.forEach(module => module.run(this.client, param_1, param_2));
                break;
            }

            case 'voiceStateUpdate': {
                const vStateUpdateModules = this.client.eventModules.filter(module => module.wsEvent === 'voiceStateUpdate');
                vStateUpdateModules.forEach(module => module.run(this.client, param_1, param_2));
                break;
            }
        }
    }
}

module.exports = EventHandler;